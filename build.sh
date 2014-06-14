#!/bin/bash

version=$(grep '"version":' manifest.json | cut -d\" -f4)

zip ~/Desktop/better-gmail-unsubscribe-$version.zip *.js icon.png manifest.json
open "https://chrome.google.com/webstore/developer/dashboard"
