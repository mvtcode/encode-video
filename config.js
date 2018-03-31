'use strict';

module.exports = {
	vcodec: 'libx264', // libx264, h264_omx, h264_nvenc
	ext: ['.mp4'],
	codec_type: 'video',
	max_rate: 25,
	output_suffix: '.enc',
	delete_source: false,
	encs: {
		'1280x720': {
			bit_rate: 1536000 //1500k
		},
		'1920x1080': {
			bit_rate: 2560000 //2500k
		}
	}
};