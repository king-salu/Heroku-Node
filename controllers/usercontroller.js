var tokentool = require('../tools/tokentools');
var datatool = require('../tools/datatools');
var spotifyWebApi = require('spotify-web-api-node');

spotifyEngine = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}); 

exports.user_details = async (req,resp) =>{
    var access_token = await tokentool.cur_token(req,resp);
    //console.log('access_token',access_token);
    spotifyEngine.setAccessToken(access_token);

    spotifyEngine.getMe()
    .then(data=>{
        const redata = datatool.spotify_user_rearray(data);
        //console.log(data);
        resp.status(201).json({
            details: redata
        });
    },
    (err)=>{
        console.log(err);
        resp.status(400).json({
            status: "failed",
            message: err
        });
    })
}