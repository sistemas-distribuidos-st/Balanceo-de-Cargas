const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

function writeImage() {
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
}