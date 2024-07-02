const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    name: { type: String, required: true },
    singer: { type: String, required: true },
    musicDirector: { type: String, required: true },
    releaseDate: { type: Date, default: Date.now }, // Default value is set to the current date
    albumName: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restricted: { type: Boolean } // New field 'restricted' with default value 'false'
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
