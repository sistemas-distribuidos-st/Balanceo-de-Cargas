const express = require("express")
const readLastLines = require('read-last-lines')
const cors = require('cors')
const multer = require('multer')
const axios = require('axios')
const { stdout } = require("process")
const formData = require('form-data')
const fs = require('fs')
const app = express()
const port = 5000
app.use(express.static(__dirname +'/public'))

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

class Server{
    constructor(){
        this.status;
        this.ip;
    }
}

let serverAStatus = false
let time = ''
let upload = multer({
    dest: "img"
})

app.post("/puttext", upload.single("img"), (req, res) => {
    const form = new formData()
    form.append('img', fs.createReadStream(req.file.path))
    
    axios.post('http://localhost:8100', form, {
        headers:{
             'Content-Type': `multipart/form-data; boundary=${form._boundary}`
        }
    }).then(res2=>{
        console.log('OK: Receiving image');
        var dd=res2.data;
        fs.writeFileSync('public/output.png', base64_decode(dd.file))
        res.redirect('output.png');
    }).catch(err =>{
        console.log('FAIL: Receiving image'); 
        res.send(err);
    })
})

setInterval(() => {
    readLastLines.read('log.txt', 5).then((lines) => {
        let data = lines.split('\n');
        for (var i = 0; i < data.length; i++) {
            if (data[i] == 'ServerA') {
                if (data[i + 1] === '')
                    serverAStatus = 'FAIL';
                else
                    serverAStatus = 'OK';
                i++;
            } else if (data[i].includes('TIME')) {
                time = data[i];
            } else {
                i++;
            }
        }
    });
}, 1000);

app.get("/", (req, res) => {
    res.send(
        [{
                hora: time,
                servidor: "Server A",
                estado: serverAStatus
        }]
    )
});

app.get("/restart", (req, res) => {
    const exec = require('child_process').exec;
    
    if (serverAStatus == 'FAIL') {
        var ss = exec('sh restart.sh 192.168.1.14', (error, stout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        })
    }
});

app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});

function base64_decode(data) {
    return new Buffer(data, 'base64');
}

function base64_encode(file) {
    return new Buffer(fs.readFileSync(file)).toString('base64');
}