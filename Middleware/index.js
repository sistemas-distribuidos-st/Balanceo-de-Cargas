const express = require("express")
const exec = require('child_process').exec;
const readLastLines = require('read-last-lines')
const cors = require('cors')
const axios = require('axios')
const nodemailer = require('nodemailer');
const app = express()
const port = 5000
const ip = '192.168.0.26'
var currentPort = 49000
var reqId = 1
var servers = [];
var requests=[];
var responses = [];

app.use(express.static(__dirname + '/public'))
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

var transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
         user: 'distribuidosst@gmail.com',
         pass: 'stSetUpTeam'
     }
 });

addServer();

app.post("/uploadData",(req, res) => {
	console.log("Connection by client");
	let rId = reqId++;
	requests.push({id: rId, body:req.body });
	
	const interval = setInterval(()=>{
		let resp = responses.find(rr => rr.id == rId);

		if(resp){
			res.send(resp.data);
			responses.splice(responses.indexOf(resp),1)
			clearInterval(interval);
		}
	}, 1000);
});

app.get("/add_server", (req, res) => {
    addServer();
    res.send("OK")
});

app.post("/", (req, res) => {
    res.send(servers)
});

app.get("/logs", (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});

setInterval(()=>{
    if(requests[0]){
        let server = servers.shift();

        if(server){
            sendImage(server, requests.shift());
        }
    }

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
        let serverIndex;

        for (var i = 0; i < lines.length; i++) {
           data = lines[i].split(' ');
           serverIndex = servers.findIndex(ss => ss.port == data[1])

           if(serverIndex != undefined){
               servers[serverIndex].monitor.time = data[0];
               servers[serverIndex].monitor.status = data[2] == "Server"
           }
        }
    });
}, 1000);

function sendImage(server, req){
	let serverURL = 'http://' + ip + ':' + server.port;
    console.log("Selected server", serverURL);
    req.body.image.name = req.id + req.body.image.name;

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
            console.log("receive image", imgRes);
        }

        servers.push(server);
        responses.push({id:req.id, data});
    }).catch(err=>{
        sendEmail(req.body.email, "Error con servidor",`El servidor ${ip}:${server.port} no sirve.`)
        console.log(err);
    });
}

function addServer(){
    let user = 'felipe';
    let pass = 'root';
    let port = currentPort++;
    console.log(`sh add-server.sh ${user} ${pass} ${ip} ${port}`);

    exec(`sh add-server.sh ${user} ${pass} ${ip} ${port}`, (error, stout, stderr) => {
        if (error !== null) {
        	if(`${error}`.includes("port is already allocated")){
            	servers.push({port, monitor:{ time:null, status:false }})
            	console.log(`Connected to server ${ip}:${port}`);
        	}else{
        		console.log(`No se pudo conectar a ${ip}:${port}`);
        	}
        }else{
            servers.push({port, monitor:{ time:null, status:false }})
            console.log(`Connected to server ${port}`);
        }
    })
}

function sendEmail(to, subject, text){
    transporter.sendMail({
         from: 'SetupTeam',
         to,subject, text
    }, (error, info) => {
        if (error) {
             console.log("EMail",error);
        } else {
             console.log('Email enviado: ' + info.response);
        }
    });
}