#!/bin/bash

sshpass -p $2 ssh $1@$3 "echo Running server...;docker run -p $4:8100 -d server-v1;"

exit
