var request = require('request');
var express = require('express');
var tokentool = require('../tools/tokentools');
var userModel = require('../models/userModel');

const cookie_code = tokentool.cookie_code;

exports.setup_accesstoken = (req,resp) =>{
    //console.log(req.body);
    const access_token = req.params.access_token;
    //const user_id = req.body.id;
    var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    };

    //console.log(options);
    request.get(options, async function (error, response, body) {
        //console.log(body);
        //console.log(response);
        try{
            if(response.statusCode==200){
                var info = {
                    id: body.id,
                    display_name: body.display_name,
                    email: body.email,
                    access_token,
                    country: body.country
                }
                

                const newUser = await userModel.user_emq()
                                               .where()
                                               .findOneAndUpdate({id: body.id},info,{new: true, upsert: true});
                //console.log(newUser);
                //Save details
            }
            resp.status(response.statusCode).json({
                details: body
            });
        } catch(err){
            resp.status(404).json({
                status: 'failed',
                message: err
            });
        }
      });

}

exports.get_cur_token = async (req,resp) =>{
    //console.log(req);
    var cur_token = null;
    const _id_ = req.params.id;
    const useDetails = await userModel.user_model.where().findOne({id:_id_},'access_token');
    //console.log(useDetails);
    if(useDetails){
        cur_token = useDetails.access_token;
    }

    resp.status(200).json({
        access: cur_token
    });
}