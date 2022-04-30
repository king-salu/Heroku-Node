var tokentool = require('../tools/tokentools');
var datatool = require('../tools/datatools');
var spotifyWebApi = require('spotify-web-api-node');
var library = require('../models/libraryModel');

spotifyEngine = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

exports.export2spotify = async (req,resp) => {
    const access_token = await tokentool.cur_token(req,resp);
    //console.log('acesss',access_token);
    const reqdate = new Date().toLocaleString();
    spotifyEngine.setAccessToken(access_token);
    var settings = {
        description: `Exported to spotify from Partner Hero Test App on ${reqdate}`, 
        public: true,
        scope: "playlist-modify-public"
    }
    await spotifyEngine.createPlaylist('PartnerHero', settings)
    .then((data)=> {
        console.log('Created playlist!');
        console.log(data);
        },(err)=>{
            console.log('Something went wrong!', err);
        });
        
    resp.status(200).json({
        status: 'success'
    });
}