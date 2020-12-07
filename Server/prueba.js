var Jimp = require("jimp");

var fileName = 'hola-adios.gif';
var imageCaption = 'Luis KYC';
var loadedImage;

Jimp.read(fileName)
    .then(function(image) {
        loadedImage = image;
        return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    })
    .then(function(font) {
        loadedImage.print(font, 10, loadedImage.bitmap.height - 20, imageCaption)
            .write(fileName);
    })
    .catch(function(err) {
        console.error(err);
    });