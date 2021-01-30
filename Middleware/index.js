const express = require("express")
const exec = require('child_process').exec;
const readLastLines = require('read-last-lines')
const cors = require('cors')
const axios = require('axios')
const { stdout } = require("process")
const fs = require('fs')
const app = express()
const port = 5000
const ip = '192.168.0.26'
var currentPort = 49000

app.use(express.static(__dirname + '/public'))
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


var servers = [
];

let serverAStatus = false
let time = ''
addServer();

app.post("/uploadData",(req, res) => {
    let server = servers.shift();
    console.log("Connection by client");

    if(server){
        let serverURL = 'http://' + ip + ':' + server.port;
        console.log("Selected server", serverURL);

        axios({
            method: 'post',
            url: serverURL + '/receiveImage',
            data: req.body.image
        }).then(imgRes=>{
            let data = imgRes.data;
            console.log("Image returns", data.ok);
            
            if(data.ok){
                data.imgURL = serverURL + '/' + req.body.image.name;
            }else{

            }
            servers.push(server);
            res.send(data)
        }).catch(err=>{
            console.log(err);
        });
    }else{
        console.log("Cancele");
    }
    
});


app.get("/add_server", (req, res) => {
    addServer();
    res.send("Añadir")
    //exec()
    //servers.push()
});

var serversInfo = [];

setInterval(() => {
    serversInfo = [];

    servers.forEach(ss=>{
        exec(`sh watch.sh ${ip} ${ss.port}`, (error, stout, stderr) => {
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        })
    });

    readLastLines.read('log.txt', servers.length).then((text) => {
        let lines = text.split('\n');
        lines.splice(lines.length - 1)
        let data;

        for (var i = 0; i < lines.length; i++) {
           data = lines[i].split(' ');
           serversInfo.push({time:data[0], port:data[1], status:data[2] == "Server"})
        }
    });
}, 1000);

app.get("/", (req, res) => {
    res.send({ serversInfo, servers })
});

app.get("/logs", (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});

function addServer(){
    let port = currentPort++;
    console.log(`sh add-server.sh felipe root ${ip} ${port}`);

    exec(`sh add-server.sh felipe root ${ip} ${port}`, (error, stout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }else{
            servers.push({port: port})
        }
    })
}

function base64_decode(data) {
    return new Buffer(data, 'base64');
}

function base64_encode(file) {
    return new Buffer(fs.readFileSync(file)).toString('base64');
}