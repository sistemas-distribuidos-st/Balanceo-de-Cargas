const express = require('express')
const fs = require('fs')
const app = express()
const port = 49000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))

app.get('/status', (req, res) => {
    res.send('Server OK')
})

app.post('/receiveImage', (req, res) => {
    let imgPath = 'public/' + req.body.name;
    fs.writeFileSync(imgPath, base64_decode(req.body.image64.split(",")[1]));

    writeImage(imgPath, randomPhrase()).then(im=>{
        res.send({ok: im})
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

function randomPhrase(){
    return 'KYC Luis';
}

function writeImage(fileName, imageCaption) {
    var Jimp = require("jimp");
    var loadedImage;

    return Jimp.read(fileName).then(image => {
        loadedImage = image;
        return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    }).then(font => {
        loadedImage.print(font, 10, loadedImage.bitmap.height - 20, imageCaption)
            .write(fileName);
        return true;
    }).catch(err => {
        console.error(err);
        return false;
    });
}

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

function base64_decode(data) {
    return new Buffer(data, 'base64');
}
