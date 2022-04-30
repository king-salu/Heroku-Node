/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const tokenRouter = require('./routes/tokenroutes');
const libraryRouter = require('./routes/libraryroutes');
const searchRouter = require('./routes/searchroutes');
const userRouter = require('./routes/userroutes');
const playlistRouter = require('./routes/playlistroutes');
const { cookie } = require('request');

//console.log(process.env);
const PORT = process.env.PORT;
var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri2 = 'http://localhost:3000/home'; // Your redirect uri
//var redirect_uri2 = process.env.REDIRECT_URI2; // Your redirect uri
//var redirect_uri = `http://localhost:${PORT}/callback`; // Your redirect uri
var redirect_uri = process.env.REDIRECT_URI.replace('<PORT>',PORT);
console.log(redirect_uri);

const DBconn = process.env.DATABASE.replace('<DATABASE_PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose
.connect(DBconn,{
//.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(con=>{
    //console.log(con.connections);
    console.log('DB connection successful');
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();


app.use(express.json())
   .use(express.urlencoded({ extended: true }))
   .use(express.static(__dirname + '/authorize'))
   .use(cors())
   .use(cookieParser())
   .use('/api/v1/spotify/token',tokenRouter)
   .use('/api/v1/spotify/library',libraryRouter)
   .use('/api/v1/spotify/search',searchRouter)
   .use('/api/v1/spotify/user',userRouter) 
   .use('/api/v1/spotify/playlist',playlistRouter);
   //



app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      grant_type: 'authorization_code',
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    //console.log('error: hello2');
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        
        //console.log(process.env);
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          if(response.statusCode == 200){
              // we can also pass the token to the browser to make requests from there
              res.redirect(redirect_uri2+'/#&' +
              //res.redirect('/#' +
                querystring.stringify({
                  u_id: body.id,
                  access_token: access_token,
                  refresh_token: refresh_token
                }));
          }
        });

        
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


app.listen(PORT,()=>{
  console.log(`Listening on ${PORT}!`);
});
