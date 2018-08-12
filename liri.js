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
      // process.argv.slice(3) - take all arguments, then, starting at index 3, add them to an array
      // .join(' ') - now join them by a space to create our songName
      var nodeArgs = process.argv.slice(3).join(' ');

      // Take the nodeArgs array and assign it to a variable called songName
      var songName = nodeArgs;
      // Call spotifySong() function, passing in songName as a parameter 
      spotifySong(songName);
      break;
    
    case "movie-this":
      // process.argv.slice(3) - take all arguments, then, starting at index 3, add them to an array
      // .join(' ') - now join them by a space to create our movieName
      var nodeArgs = process.argv.slice(3).join(' ');

      // Take the nodeArgs array and assign it to a variable called movieName
      var movieName = nodeArgs;
      // Call movieThis() function, passing in movieName as a parameter 
      movieThis(movieName);
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
            tweets.forEach((singleTweet, i) => {
                console.log("Tweet created on: " + singleTweet.created_at);
                console.log("Tweet text: " + singleTweet.text);
            });
        } else {
            console.log("Twitter API returned an error: " + error);
        }
    });
}

//----------------PROCESS SPOTIFY-----------------------------//

function spotifySong(songName) {

    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    // If no song is entered, set songName to "The Sign by Ace of Base"
    if (songName.length === 0) {
        songName = "The Sign by Ace of Base";
        // added limit 1 so it will return only 1 song
        spotify.search({ type: 'track', query: songName, limit: 1}, function(error, song) {
            // fetch details for "The Sign by Ace of Base"
                if (!error) {
                    console.log("You didn't provide a song so here are details for 'The Sign' by Ace of Base");
                    // Return the song name
                    console.log("Song name: " + song.tracks.items[0].name);
                    // Return the artist's name
                    console.log("Artist's name: " + song.tracks.items[0].artists[0].name);
                        if (song.tracks.items[0].preview_url) {
                            // If present, return the preview link
                            console.log("Preview URL: " + song.tracks.items[0].preview_url);
                        } else {
                            // Otherwise, return sorry message
                            console.log("Preview URL: Sorry, there is no preview for this song.");
                        }
                    // Return the album name
                    console.log("Album name: " + song.tracks.items[0].album.name);
                } else {
                    console.log("Spotify API returned an error: " + error);
                }
        });
    // Otherwise, if a song is entered, fetch details for that song
    } else {
                // added limit 1 so it will return only 1 song
        spotify.search({ type: 'track', query: songName, limit: 1}, function(error, song) {
            // If a song is entered, and no errors, fetch details 
                if (!error) { 
                    // Return the song name
                    console.log("Song name: " + song.tracks.items[0].name);
                    // Return the artist's name
                    console.log("Artist's name: " + song.tracks.items[0].artists[0].name);
                        if (song.tracks.items[0].preview_url) {
                            // If present, return the preview link
                            console.log("Preview URL: " + song.tracks.items[0].preview_url);
                        } else {
                            // Otherwise, return sorry message
                            console.log("Preview URL: Sorry, there is no preview for this song.");
                        }
                    // Return the album name
                    console.log("Album name: " + song.tracks.items[0].album.name);
                } else {
                    console.log("Spotify API returned an error: " + error);
                }
        });
    }

}
//----------------PROCESS OMDB-----------------------------//

function movieThis(movieName) {
    
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
                    console.log("You didn't provide a movie so here are details for 'Mr. Nobody' ");
                    console.log("Title: " + JSON.parse(body).Title);
                    console.log("Release Year: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Country where movie was produced: " + JSON.parse(body).Country);
                    console.log("Language of the movie: " + JSON.parse(body).Language);
                    console.log("Plot of the movie: " + JSON.parse(body).Plot);
                    console.log("Actors in the movie: " + JSON.parse(body).Actors);
                }
            });
            
        } else {
            // If a movie was provided, run a request to the OMDB API with the movie specified
            var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

            // Submit a request to OMDB API
            request(queryUrl, function(error, response, body) {

                // If the request is successful
                if (!error && response.statusCode === 200) {
                    //Parse the body of the site and recover the data we want
                    console.log("Title: " + JSON.parse(body).Title);
                    console.log("Release Year: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Country where movie was produced: " + JSON.parse(body).Country);
                    console.log("Language of the movie: " + JSON.parse(body).Language);
                    console.log("Plot of the movie: " + JSON.parse(body).Plot);
                    console.log("Actors in the movie: " + JSON.parse(body).Actors);
                } else {
                    console.log("OMDB API returned an error: " + error);
                }
            });
        }
}

//----------------PROCESS DO-WHAT-IT-SAYS-------------------//

function doIt() {

    fs.readFile("random.txt", "utf8", function(error, data) {

            // If the code experiences any errors, log the error to the console.
            if (error) {
                return console.log(error);
            }
            else {
                // Break the string down by comma separation and store the contents into the output array.
                var output = data.split(",");

                var action = output[0];
            
                // Remove the double quotes
                // var value = output[1].replace(/["]+/g, ''); --> took out the replace, doesn't handle valid apostrophes
                var value = output[1];
            
                // Loop Through the newly created output array
                for (var i = 1; i < output.length; i++) {
    
                    switch (action) {
                        case "my-tweets":
                        myTweets(); 
                        break;
    
                        case "spotify-this-song":
                        spotifySong(value);
                        break;
                        
                        case "movie-this":
                        movieThis(JSON.stringify(value));
                        break;
                        
                        case "do-what-it-says":
                        doIt(JSON.stringify(value));
                        break;
                        }
                }
            }
    });
}