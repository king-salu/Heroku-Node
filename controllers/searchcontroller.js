var tokentool = require('../tools/tokentools');
var datatool = require('../tools/datatools');
var spotifyWebApi = require('spotify-web-api-node');
const res = require('express/lib/response');

spotifyEngine = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}); 

exports.search = async (req,resp)=>{
    var keyword = req.params.keyword;
    var access_token = await tokentool.cur_token(req,resp);
    //console.log('access_token',access_token);
    spotifyEngine.setAccessToken(access_token);
    spotifyEngine.searchTracks(`track:${keyword}`)
    .then((data)=>{
        //console.log(data);
        const redata = datatool.spotify_music_rearray(data);
        resp.status(201).json({
            details: redata
            //details: data
        });
    }, (err)=>{
        //console.log(err);
        resp.status(400).json({
            status: "failed",
            message: err
        });
    });
}