#!/bin/bash

sshpass -p 'd' ssh davidma1021@$1 'echo "reboot service...";cd lab;git clone https://github.com/sistemas-distribuidos-st/Middleware.git;cd Middleware/ServerA;npm install;echo "starting service...";pm2 start index.js;echo "service restored...";'
exit
