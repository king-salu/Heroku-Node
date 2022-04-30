const mongoose = require('mongoose');

const library_schema = new mongoose.Schema({
    user_id: {
        type: String,
        required: [true, "Library must belong to an account id"]
    },
    name: {
        type: String,
        required: [true,"name can't be empty"]
    },
    type: {
        type: String,
        required: [true,"library must have a type"]
    },
    id: {
        type: String,
        required: [true,"id must be made available"],
        unique: true
    },
    images: {
        type: Object
    },
    spotify_url: String,
    artists: {
        type: Object
    }
});


exports.library_model = mongoose.model('library',library_schema);

exports.library_emq = () =>{
    var emq = this.library_model.find();
    emq.setOptions({lean: true});
    emq.collection(this.library_model.collection);

    return emq;
}
