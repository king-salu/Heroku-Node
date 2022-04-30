var tokentool = require('../tools/tokentools');
var datatool = require('../tools/datatools');
var spotifyWebApi = require('spotify-web-api-node');
var library = require('../models/libraryModel');



spotifyEngine = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}); 

exports.new_release = async (req,resp)=>{
    //console.log(req.params);
    const access_token = await tokentool.cur_token(req,resp);
    //console.log('acesss',access_token);
    spotifyEngine.setAccessToken(access_token);
    
    var options = {
        limit : 10, offset: 0, country: 'NG'
    }
    spotifyEngine.getNewReleases(options)
    .then((data)=>{
        const redata = datatool.spotify_music_rearray(data);
        //console.log(redata);
        resp.status(201).json({
            details: redata
            //details: data
        });
    },(err)=>{
        resp.status(400).json({
            status: "failed",
            message: err
        });
    });
}

exports.mylibrary = async (req,resp)=>{
    try{
        const access_token = await tokentool.cur_token(req,resp);
        spotifyEngine.setAccessToken(access_token);
        await spotifyEngine.getMe((data)=>{ },(err)=>{
            resp.status(404).json({
                status: 'fail',
                message: err
            });
        });
        const id = req.params.id;
        const mylibraries = await library.library_model.find({user_id:id});
        console.log(mylibraries);
        resp.status(200).json({
            status: 'success',
            results: mylibraries.length,
            data: mylibraries
        });

        
        
    } catch(err){
        resp.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.add2library = async (req,resp) =>{
    //console.log(req.params);
    const access_token = await tokentool.cur_token(req,resp);
    spotifyEngine.setAccessToken(access_token);
    const item_type = req.params.type;
    let redata = null;
    switch (item_type){
        case "album":
            redata = await spotifyEngine.getAlbum(req.params.lib_id)
            .then((data)=> {
                //console.log('Album information', data.body);
                const response = datatool.restructure(data.body,0);

                return response;
                
            }, (err)=>{
                console.error(err);
                resp.status(400).json({
                    status: 'failed',
                    message: err
                });
            });
            break;

        case "track":
            redata = await spotifyEngine.getTrack(req.params.lib_id)
            .then((data)=>{
                const response = datatool.restructure(data.body,0);
                return response;
            },(err)=>{
                resp.status(400).json({
                    status: 'failed',
                    message: err
                });
            });
            break;
    }

   // console.log('Spot On',redata);
    if(redata){
        const id = req.params.id;
        redata.user_id = id;
        //console.log(redata);
        const libAdded = await library.library_model
                                .where()
                                .findOneAndUpdate({id:redata.id,user_id:id},redata,
            {
                new: true,
                upsert: true,
                overwrite: true
            });

            //console.log(libAdded);

        resp.status(200).json({
            status: 'success',
            body: libAdded
        });
    }

    
    // spotifyEngine.getMe((data)=>{
    //     const id = req.params.id;
    //     //await library.library_model.insert
    // },(err)=>{

    // });
}

exports.remove4rmlibrary = async (req, resp) =>{
    const access_token = await tokentool.cur_token(req,resp);
    spotifyEngine.setAccessToken(access_token);
    await spotifyEngine.getMe((data)=>{},(err)=>{
        resp.status(400).json({
            status: 'failed',
            message: err
        });
    });

    const sid = req.params.id;
    const lib_id = req.params.lib_id;
    const deleted = await library.library_model.remove({user_id:sid,id:lib_id});
    console.log('delete: ',deleted);
    resp.status(200).json({
        status: 'success',
        affected_docs: deleted.deletedCount
    });
}