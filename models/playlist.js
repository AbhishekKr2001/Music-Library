const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }] // Storing ObjectIds in the array
});

const Playlist = mongoose.model('Playlist', songSchema);

module.exports = Playlist;
