var mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    id: {
        type: String,
        required: [true,"id must be available"],
        unique: true
    },
    display_name: {
        type: String,
        required: [true, "Name can't be empty"]
    },
    email: {
        type: String,
        required: [true,"email must be set"]
    },
    access_token: {
        type: String,
        unique: true
    },
    country: String
});

exports.user_model = mongoose.model('user',user_schema);

exports.user_emq = () =>{
    var emq = this.user_model.find();
    emq.setOptions({lean: true});
    emq.collection(this.user_model.collection);

    return emq;
}