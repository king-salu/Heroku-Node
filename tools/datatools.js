exports.restructure = (element,key) => {
    var _artists = [];
    var _images = [];
    if(element.artists) _artists = spotify_artist_rearray(element.artists);
    if(element.album) _images = element.album.images;
    if(element.images) _images = element.images;
    var _object = {
        name: element.name,
        type : element.type,
        id: element.id,
        images: _images,
        artists: _artists,
        release_date: element.release_date,
        total_tracks: element.total_tracks,
        spotify_url: element.external_urls.spotify
    }

    return _object;
}

exports.spotify_music_rearray = (data)=>{
    var rearray = [];
    //console.log(data);
    if(data.body.albums){
        data.body.albums.items.forEach((element,key) => {
            const result = this.restructure(element,key);
            rearray.push(result);
        });
    }

    if (data.body.tracks){
        data.body.tracks.items.forEach((element,key) => {
            const result = this.restructure(element,key);
            rearray.push(result);
        });
    }

    return rearray;
}

exports.spotify_user_rearray = (data) =>{
    var _object = {};
    if(data){
        _object = {
            id: data.body.id,
            display_name: data.body.display_name,
            email: data.body.email,
            images: data.body.images,
            statusCode: data.statusCode
        }
    }

    return _object;
}

function spotify_artist_rearray(data) {
    var rearray = [];
    if(data.length > 0){
        data.forEach((artist)=>{
            var _object = {
                id: artist.id,
                name: artist.name
            }

            rearray.push(_object);
        });
    }

    return rearray;
}