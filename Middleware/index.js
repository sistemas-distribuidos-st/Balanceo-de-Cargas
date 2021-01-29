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
const ip = 'http://localhost';
app.use(express.static(__dirname + '/public'))

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

var servers = [
    {ip:'http://localhost:8100', port:'49000'}
];

let serverAStatus = false
let time = ''
let upload = multer({
    storage: multer.diskStorage({
        destination: './img/',
        filename: function (req, file, cb) {
            cb( null, Date.now() + '-' + file.originalname);
        }
    })
})

app.post("/puttext", upload.single("img"), (req, res) => {
    const form = new formData()
    form.append('img', fs.createReadStream(req.file.path))
    var server = servers.shift();
   
    axios.post(server.ip, form, {
        headers:{
             'Content-Type': `multipart/form-data; boundary=${form._boundary}`
        }
    }).then(res2=>{
        console.log('OK: Receiving image');
        var dd = res2.data;
        fs.writeFileSync('public/output.png', base64_decode(dd.file))
        res.redirect('output.png');
        servers.push(server)
    }).catch(err =>{
        console.log('FAIL');
        servers.splice(server);
        res.send(err);
    })
})

app.post("/uploadImage",upload.single("img"), (req, res) => {
    console.log(req.body.email);
    console.log(req.file.path);

    res.send("Cliente")
});

app.post("/uploadData",(req, res) => {
    let serverURL = ip + ':' + servers[0].port;

    axios({
        method: 'post',
        url: serverURL + '/receiveImage',
        data: req.body.image
    }).then(imgRes=>{
        let data = imgRes.data;
        data.imgURL = serverURL + '/' + req.body.image.name;
        res.send(data)
    })
});


app.get("/add_server", (req, res) => {
    res.send("Añadir")
    //exec()
    //servers.push()
});


var serversInfo = [];

setInterval(() => {
    serversInfo = [];

    readLastLines.read('log.txt', servers.length).then((text) => {
        let lines = text.split('\n');
        lines.splice(lines.length - 1)
        let data;
        for (var i = 0; i < lines.length; i++) {
           data = lines[i].split(' ');
           serversInfo.push({time:data[0], ip:data[1], status:data[2] ==="OK"})
        }
    });
}, 1000);

app.get("/", (req, res) => {
    res.send({ serversInfo, servers })
});

app.get("/logs", (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.get("/restart", (req, res) => {
    const exec = require('child_process').exec;
    
    if (serverAStatus == 'FAIL') {
        exec('sh restart.sh 192.168.1.14', (error, stout, stderr) => {
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