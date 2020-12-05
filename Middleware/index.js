const express = require("express");
const readLastLines = require('read-last-lines');
const cors = require('cors')
const port = 3000;
const app = express();
var bodyParser = require('body-parser');
const { stdout } = require("process");

app.use(cors({ origin: true, credentials: true }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: false }));
let serverAStatus = false;
let serverBStatus = false;
let time = '';

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
            } else if (data[i] == 'ServerB') {
                if (data[i + 1] === '')
                    serverBStatus = 'FAIL';
                else
                    serverBStatus = 'OK';
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
            },
            {
                hora: time,
                servidor: "Server B",
                estado: serverBStatus
            },

        ]
    )
});

app.get("/restart", (req, res) => {
	const exec = require('child_process').exec;
	if( serverBStatus == 'FAIL'){
		var yourscript = exec('sh restart.sh 192.168.1.15', (error, stout, stderr) => {
				console.log(`${stdout}`);
				console.log(`${stderr}`);
				if (error !== null) {
					console.log(`exec error: ${error}`);
				}
			})
	}
	if( serverAStatus == 'FAIL'){
		var yourscript = exec('sh restart.sh 192.168.1.14', (error, stout, stderr) => {
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
