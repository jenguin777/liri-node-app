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

switch (action) {
    case "my-tweets":
      myTweets(); 
      break;

    case "spotify-this-song":
      spotifySong();
      break;
    
    case "movie-this":
      movieThis();
      break;
    
    case "do-what-it-says":
      doIt();
      break;
    }

//----------------PROCESS TWITTER-----------------------------//

// Create instance of Twitter object, actual keys not displayed this way
var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret,
  });

// Wrapping the client.get call in a function or case statement does NOT work...I get TypeError: Cannot read property 'get' of undefined
function myTweets() {

    // Create instance of Twitter object, actual keys not displayed this way
    var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret,
  });
    
  // Call client.get method from twitter npm pkg
    var params = {screen_name: 'jenguin777', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log("|REMOVE BEFORE SUBMISSION--------BEGIN TWITTER---------|");
            tweets.forEach((singleTweet, i) => {
                console.log("Tweet created on: " + singleTweet.created_at);
                console.log("Tweet text: " + singleTweet.text);
            });
        } else {
            console.log(error);
        }
        console.log("|REMOVE BEFORE SUBMISSION--------END TWITTER-----------|");
    });
}

//----------------PROCESS SPOTIFY-----------------------------//

// Wrapping the spotify.search call in a function or case statement does NOT work...I get TypeError: Cannot read property 'get' of undefined
function spotifySong() {

    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    console.log("spotify object" + JSON.stringify(spotify, null, 4));
    var nodeArgs = process.argv.slice(3).join(' ');
    console.log("nodeArgs: " + nodeArgs);

    // Create an empty variable for holding the movie name
    var songName = nodeArgs; 


    // var songName = "";
    // nodeArgs = process.argv;

    // Loop through all the words in the node argument starting at index 3
    // for (var i = 3; i< nodeArgs.length; i++) {
    //     //strip off the last plus sign
    //     if(i > 3 && i < nodeArgs.length) {
    //         songName = songName + "+" + nodeArgs[i];
    //     }
    //     else {
    //         songName += nodeArgs[i];
    //     }
    // }

    console.log("songName: " + songName);


    // added limit 1 so it will return only 1 song
    spotify.search({ type: 'track', query: songName, limit: 1}, function(error, song) {
        // If a song is entered, fetch details 
        if (song) {
            if (!error) {
                // console.log(JSON.stringify(song, null, 2));
                console.log("|REMOVE BEFORE SUBMISSION--------BEGIN SPOTIFY---------|");
                // Return the song name
                console.log("Song name: " + song.tracks.items[0].name);
                // Return the artist's name
                console.log("Artist's name: " + song.tracks.items[0].artists[0].name);
                // Return the album name
                console.log("Album name: " + song.tracks.items[0].album.name);
                if (song.tracks.items[0].preview_url) {
                    // If present, return the preview link
                    console.log("Preview URL: " + song.tracks.items[0].preview_url);
                }
                // Otherwise, return sorry message
                else {
                    console.log("Preview URL: Sorry, there is no preview for this song.");
                }
            } else {
                console.log(error);
            }
            console.log("|REMOVE BEFORE SUBMISSION--------END SPOTIFY-----------|");
        // Otherwise, return details for The Sign by Ace of Base
        } else {
            console.log("The Sign" + "\nAce of Base" + "\nThe Sigh" + "https://open.spotify.com/search/songs/The%20Sign");
        }
    });
}

//----------------PROCESS OMDB-----------------------------//

function movieThis() {
    
    console.log("|REMOVE BEFORE SUBMISSION--------BEGIN OMDB------------|");
    // Store all of the arguments in an array -- problem with this is that it doesn't handle when no movie was passed
    var nodeArgs = process.argv.slice(3).join(' ');
    console.log("nodeArgs: " + nodeArgs);

    // Create an empty variable for holding the movie name
    var movieName = nodeArgs; //this may be evaluating to false....need to check
    // --------remove this???  if(movieName) {
        // // Loop through all the words in the node argument
        // // And do a little for-loop magic to handle the inclusion of "+"s
        //     for (var i = 3; i < nodeArgs.length; i++) {
        //         console.log("movieName: " + movieName);
        //         if (i > 3 && i < nodeArgs.length) {
        //             movieName = movieName + "+" + nodeArgs[i];
        //         }
        //         else {
        //             movieName += nodeArgs[i];
        //         }
        //     }
        console.log("movieName: " + movieName);

        // If no movie was provided, set movieName to "Mr. Nobody" and make another call to movieThis() function
        if (movieName.length === 0) {
            movieName = "Mr. Nobody";
            // Then run a request to the OMDB API with the movie specified
            var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

            // Submit a request to OMDB API
            request(queryUrl, function(error, response, body) {

                // If the request is successful
                if (!error && response.statusCode === 200) {

                    // Parse the body of the site and recover the data we want
                    console.log("Title: " + JSON.parse(body).Title);
                    console.log("Release Year: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                    // console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Country where movie was produced: " + JSON.parse(body).Country);
                    console.log("Language of the movie: " + JSON.parse(body).Language);
                    console.log("Plot of the movie: " + JSON.parse(body).Plot);
                    console.log("Actors in the movie: " + JSON.parse(body).Actors);
                    console.log(body);
                }
            });
            
        } else {
                // Then run a request to the OMDB API with the movie specified
                var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
                console.log(queryUrl);

                // Submit a request to OMDB API
                request(queryUrl, function(error, response, body) {

                    // If the request is successful
                    if (!error && response.statusCode === 200) {
                        console.log(body);
                        // Parse the body of the site and recover the data we want
                        // console.log("Title: " + JSON.parse(body).Title);
                        // console.log("Release Year: " + JSON.parse(body).Year);
                        // console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                        // // console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                        // console.log("Country where movie was produced: " + JSON.parse(body).Country);
                        // console.log("Language of the movie: " + JSON.parse(body).Language);
                        // console.log("Plot of the movie: " + JSON.parse(body).Plot);
                        // console.log("Actors in the movie: " + JSON.parse(body).Actors);
                    }
                });
            }
    // }
console.log("|REMOVE BEFORE SUBMISSION--------END OMDB--------------|");
}