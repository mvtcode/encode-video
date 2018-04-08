'use strict';
/**
* Auth: tanmv
* Fb: fb/mvt.hp.star
* Updated: 2018-03-31 11:00
* Run: dir="/media/tanmv/Videos" node app.js
*/

const fs = require('fs');
const path = require('path');
const colors = require('colors');
const getVideoInfo = require('get-video-info');
const spawn = require('child_process').spawn;
const config = require('./config');

const historyFile = './history.txt';
const dirRoot = process.env.dir || '.';

const encode = async (file, out, ext, enc) => {
	return new Promise(resolve => {
		const tempFile = path.join(path.dirname(out), `${path.basename(out, ext)}_tmp${ext}`);
		let params = ['-i',file,'-c:v', config.vcodec,'-r',enc.r,'-b:v',enc.bv,'-c:a','copy','-y',tempFile];
		if(config.vcodec === 'h264_omx') {
			params.unshift('-c:v', 'h264_mmal');
		} else if(config.vcodec === 'h264_nvenc') {
			params.unshift('-hwaccel', 'cuvid', '-c:v', 'h264_cuvid');
		}
		const work = spawn('ffmpeg',params);
		work.stdout.on('data', (data) => {
			console.log(colors.cyan('FFMPEG:'), `${data}`);
		});
		work.stderr.on('data', (data) => {
			console.log(colors.cyan(colors.cyan('FFMPEG:'), `${data}`));
		});
		work.on('close', (code) => {
			console.log(colors.cyan('FFMPEG:'), `exited with code ${code}`);
			if(code === 0 && fs.existsSync(tempFile)) {
				fs.renameSync(tempFile, out);
			}
			resolve(code);
		});
	});
};

const readDir = async (dir) => {
	console.log('read dir:', dir);
	const files = fs.readdirSync(dir);
	if(files && files.length > 0) {
		for(let file of files) {
			const fullPath = path.join(dir, file);
			const stat = fs.lstatSync(fullPath);
			if (stat.isDirectory()){
				await readDir(fullPath);
			} else if(stat.isFile()) {
				const extOrigin = path.extname(fullPath);
				const ext = extOrigin.toLowerCase();
				if(config.ext.indexOf(ext) >= 0) {
					const info = await getVideoInfo(fullPath);
					if(info) {
						const videoCode = info.streams.find(stream => {
							return stream.codec_type === config.codec_type;
						});
						if(videoCode) {
							const outFile = path.join(dir, path.basename(file, extOrigin) + config.output_suffix + ext);
							if(!fs.existsSync(outFile)) {
								const size = `${videoCode.width}x${videoCode.height}`;
								const enc_standard = config.encs[size];
								if(enc_standard) {
									if(videoCode.bit_rate > enc_standard.bit_rate) {
										const enc = {
											r: Math.min(eval(videoCode.r_frame_rate), config.max_rate),
											bv: enc_standard.bit_rate
										};
										const exit_code = await encode(fullPath, outFile, ext, enc);
										fs.appendFileSync(historyFile, `${new Date().toLocaleString()} ${fullPath}`);
										if(config.delete_source && exit_code === 0) {
											fs.unlinkSync(fullPath);
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};

readDir(dirRoot);