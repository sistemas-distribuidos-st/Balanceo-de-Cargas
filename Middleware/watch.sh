#!/bin/bash

watch -n 0.5 "(echo -n `date +'%H:%M:%S'`;echo -n ' $1 ';curl $1:8100/status;echo '') >> log.txt"
