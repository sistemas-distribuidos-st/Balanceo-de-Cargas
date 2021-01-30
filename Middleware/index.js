const express = require("express")
const readLastLines = require('read-last-lines')
const cors = require('cors')
const axios = require('axios')
const { stdout } = require("process")
const fs = require('fs')
const app = express()
const port = 5000
const ip = 'http://192.168.0.26'
var currentPort = 49000

app.use(express.static(__dirname + '/public'))
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

var servers = [
];

let serverAStatus = false
let time = ''

app.post("/uploadData",(req, res) => {
    console.log("Connection by client");
    let serverURL = ip + ':' + servers[0].port;
    console.log("Selected server", serverURL);

    axios({
        method: 'post',
        url: serverURL + '/receiveImage',
        data: req.body.image
    }).then(imgRes=>{
        let data = imgRes.data;
        console.log("Image returns", data.ok);
        
        if(data.ok)
            data.imgURL = serverURL + '/' + req.body.image.name;

         res.send(data)
        
    }).catch(err=>{
        console.log(err);
    });
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
           serversInfo.push({time:data[0], ip:'', status:data[2] ==="OK"})
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

function addServer(){
    let port = currentPort++;
     exec(`sh add-server.sh felipe root ${ip} ${port}`, (error, stout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    })

    servers.push({ port: port})
}