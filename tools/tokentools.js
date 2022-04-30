var express = require('express');
var usermodel = require('../models/userModel');
var spotifyWebApi = require('spotify-web-api-node');

spotifyEngine = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

const cookie_code = 'tkntbu4cu'

exports.cookie_code = cookie_code;

exports.cur_token = async (req,resp)=>{
    var cur_tko = null;
    const _id_ = req.params.id;
    const user = await usermodel.user_emq()
                                .where()
                                .findOne({id: _id_});
    //console.log('setupooo',user);
    if(user){
        spotifyEngine.setAccessToken(user.access_token);
        await spotifyEngine.getMe()
        .then(data=>{
            cur_tko = user.access_token;
        },err=>{
            const redirect_url = process.env.MAIN_URI.replace('<PORT>',process.env.PORT);
            
            resp.redirect(redirect_url);
        });
    }


    

    return cur_tko;
}