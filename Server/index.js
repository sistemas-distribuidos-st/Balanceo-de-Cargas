const express = require('express')
const fs = require('fs')
const app = express()
const port = 49000
var lines = [];
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))

fs.readFile('phrases.txt', 'utf8', (err, data)=>{
     lines = data.split("\n");
});

app.get('/status', (req, res) => {
    res.send('Server OK')
})

app.post('/receiveImage', (req, res) => {
    console.log("Receive image from middleware", req.body.name);
    let imgPath = 'public/' + req.body.name;
    fs.writeFileSync(imgPath, base64_decode(req.body.image64.split(",")[1]));
    console.log("Saved image");

    writeImage(imgPath, getRandomPhrase()).then(im=>{
        console.log("Return state", im);
        res.send({ok: im})
      
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

function writeImage(fileName, imageCaption) {
    var Jimp = require("jimp");
    var loadedImage;

    return Jimp.read(fileName).then(image => {
        loadedImage = image;
        return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    }).then(font => {
        loadedImage.print(font, 10, loadedImage.bitmap.height - 20, imageCaption).write(fileName);
        return true;
    }).catch(err => {
        console.error(err);
        return false;
    });
}

function getRandomPhrase() {
    return lines[getRandomArbitrary(1, 26)];
}

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

function base64_decode(data) {
    return new Buffer(data, 'base64');
}
