const express = require('express')
const multer = require('multer')
const axios = require('axios')
const fs = require('fs')
const formData = require('form-data')
var path = require('path'); 
const app = express()
const port = 8100
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

let upload = multer({
    dest: "img"
})

app.get('/status', (req, res) => {
    res.send('Server OK')
})

app.post('/', upload.single("img"), (req, res) => {
    console.log('Entry image')
    writeImage(req.file.path,randomPhrase()).then(res2=>{
        setTimeout(()=>{
            console.log(res2);
            res.send({
                name:req.file.filename,
                file:base64_encode(req.file.path)
            });
            console.log('Image sended')
        },10)
    })
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
        return 'Frase colocada.';
    }).catch(err => {
        console.error(err);
        return 'FAIL';
    });
}

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}