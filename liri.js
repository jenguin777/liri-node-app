//----------------ENVIRONMENT-----------------------------//

// read and set any environment variables defined per .env and keys.js with the dotenv package
var getEnv = require("dotenv").config();
var keys = require("./keys.js");

//----------------INSTALLED PACKAGES-----------------------------//

// node-spotify-api --> need to use the readme.md in the specific package's directory
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var fs = require("fs");

//----------------TAKE IN COMMANDS-----------------------------//

var action = process.argv[2];

// Make it so liri.js can take in one of the following commands:
//     * `my-tweets`
//     * `spotify-this-song`
//     * `movie-this`
//     * `do-what-it-says`

// We will then create a switch-case statement (if-else would also work).
// The switch-case will direct which function gets run.

// switch (action) {
//     case "my-tweets":
//       myTweets(); 
//       break;

//     case "spotify-this-song":
//       spotifySong();
//       break;
    
//     case "movie-this":
//       movieThis();
//       break;
    
//     case "do-what-it-says":
//       doIt();
//       break;
//     }

//----------------PROCESS TWITTER-----------------------------//

// Create instance of Twitter object, actual keys not displayed this way
var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret,
  });

// Wrapping the client.get call in a function or case statement does NOT work...I get TypeError: Cannot read property 'get' of undefined
// function myTweets() {
// Call client.get method from twitter npm pkg
    var params = {screen_name: 'jenguin777', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log("|--------BEGIN TWITTER---------");
            tweets.forEach((singleTweet, i) => {
                console.log(singleTweet.created_at);
                console.log(singleTweet.text);
            });
        } else {
            console.log(error);
        }
        console.log("|--------END TWITTER---------");
    });
// }

//----------------SPOTIFY-----------------------------//

var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

// function spotifySong() {
    // added limit 1 so it will return only 1 song
    spotify.search({ type: 'track', query: 'All the Small Things', limit: 1}, function(error, song) {
        if (!error) {
            // console.log(JSON.stringify(song, null, 2));
            console.log("|--------BEGIN SPOTIFY---------");
            // Return the song name
            console.log(song.tracks.items[0].name);
            // Return the artist's name
            console.log(song.tracks.items[0].artists[0].name);
            // Return the album name
            console.log(song.tracks.items[0].album.name);
            if (song.tracks.items[0].preview_url) {
                // Return the preview link
            console.log(song.tracks.items[0].preview_url);
            }
            else {
                console.log("Sorry, there is no preview for this song.");
            }
        } else {
            console.log(error);
        }
        console.log("|--------END SPOTIFY---------");
    });
// }



