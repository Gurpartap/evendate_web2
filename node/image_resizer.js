
var easyimage = require('easyimage'),
	gm = require('gm').subClass({imageMagick: true}),
	fs = require('fs');

const IMG_WIDTHS = {
	'small': {
		'vertical': 200,
		'horizontal': 200
	},
	'medium': {
		'vertical': 320,
		'horizontal': 320
	},
	'large': {
		'vertical': null,
		'horizontal': null
	},
	square: {
		'vertical': 400,
		'horizontal': 400
	}
};

function ImagesResize(settings) {
	this.settings = settings;
}

ImagesResize.prototype.resizeFile = function(settings){
	easyimage.resize({
		src: settings.source,
		dst: settings.destination,
		width: IMG_WIDTHS[settings.size][settings.orientation]
	})
};

ImagesResize.prototype.cropToSquare = function(settings){
	easyimage.info(settings.source).then(
		function(file) {
			var rescrop_settings = {
					src: settings.source,
					dst: settings.destination,
					cropwidth: IMG_WIDTHS.square.horizontal,
					cropheight: IMG_WIDTHS.square.horizontal
				};

			if (file.width >= file.height){
				rescrop_settings.height = 400;
				rescrop_settings.width = 400 * 10 / 7;
			}else{
				rescrop_settings.width = 400;
				rescrop_settings.height = 400 * 10 / 7;
			}
			easyimage.rescrop(rescrop_settings).then(
				function (image) {},
				function (err) {
					console.log(err);
				}
			);
		},
		function (err) {
			console.log(err);
		}
	);
};

ImagesResize.prototype.blurImage = function(settings, cb){
	gm(settings.src)
		.resize(500, 500)
		.contrast(-6)
		.blur(30, 20)
	.write(settings.dest, cb);
};

module.exports = ImagesResize;