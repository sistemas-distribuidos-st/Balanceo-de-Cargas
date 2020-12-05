#!/bin/bash

watch -n 0.5 "(date '+TIME:%H:%M:%S'; echo 'ServerA' ; curl 192.168.1.14:3000; echo '' ;echo 'ServerB' ; curl 192.168.1.15:3000 ; echo '') >> log.txt"
