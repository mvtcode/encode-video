'use strict';

module.exports = {
	ext: ['.mp4'],
	codec_type: 'video',
	max_rate: 25,
	output_suffix: '.enc',
	encs: {
		'1280x720': {
			bit_rate: 1536000 //1500k
		},
		'1920x1080': {
			bit_rate: 2560000 //2500k
		}
	}
};