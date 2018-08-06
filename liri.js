// At the top of the `liri.js` file, add code to read and set any environment variables with the dotenv package
//Jennifer@idea-PC MINGW64 ~/liri-node-app (liribranch)
// $ npm install dotenv --save
// npm notice created a lockfile as package-lock.json. You should commit this file.
// + dotenv@6.0.0
// added 1 package in 0.894s
var getEnv = require("dotenv").config();

// code required to import the `keys.js` file stored it in a variable
var keysINeed = require("./keys.js");
var spotify = new Spotify(keysINeed.spotify);
console.log(spotify);
var client = new Twitter(keysINeed.twitter);
console.log(twitter);

// fs is a core Node package for reading and writing files
// Jennifer@idea-PC MINGW64 ~/liri-node-app (liribranch)
// $ npm install fs
// + fs@0.0.1-security
// added 1 package in 1.876s
var fs = require("fs");

// Request is designed to be the simplest way possible to make http calls.
// Jennifer@idea-PC MINGW64 ~/liri-node-app (liribranch)
// $ npm install request
// + request@2.87.0
// added 46 packages in 10.466s
var request = require("request");

