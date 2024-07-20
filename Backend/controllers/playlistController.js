const Song = require('../models/song');
const User = require('../models/user');
const Playlist = require('../models/playlist')

//to get all the playlist
exports.getAllPlaylist = async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//to get playlist for a particular user
//localhost:5000/playlist/662a195561b0c57334b2afbf
exports.getPlaylistByUserId = async (req, res) => {
    try {
        const playlist = await Playlist.find({ createdBy: req.params.id }).populate('songs');
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//to add new playlist
exports.addPlaylist = async (req, res) => {
    try {
        // Check if the user is an admin
        const { name } = req.body
        if (req.session.authorization.role !== 'user') {
            return res.status(403).json({ message: 'Forbidden: Only user can add new Playlist' });
        }
        const userEmail = req.session.authorization.email;
        const userCreater = await User.findOne({ email: userEmail, role: 'user' });


        if (!userCreater) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Assuming you have the user ID in req.user
        const createdBy = userCreater._id;
        const newPlaylist = new Playlist({ createdBy, name });

        await newPlaylist.save();

        userCreater.playlists.push(newPlaylist._id);
        await userCreater.save();
        res.status(201).json({ message: 'playlist added successfully', newPlaylist });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//to delete playlist by Id
//662a21b286c70d19534c3c40
exports.deletePlaylistById = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const userEmail = req.session.authorization.email;

        const user1 = await User.findOne({ email: userEmail, role: 'user' });
        const userId = user1._id;

        const playlist1 = await Playlist.findById(playlistId);

        if (!playlist1) {
            return res.status(404).json({ message: 'Playlist not found' });
        }


        if (playlist1.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You are not the creator of this Playlist' });
        }

        await Playlist.findByIdAndDelete(playlistId);
        user1.playlists.pop(playlist1._id);
        await user1.save();

        res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**{

 "songName":"Lungi DANCE", "playlistName":"playlist1"
} */
//to add songs to a playlist using songName and playlist name
exports.addSongToPlaylist = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.session.authorization.role !== 'user') {
            return res.status(403).json({ message: 'Forbidden: Only user can add new songs' });
        }

        const { songName, playlistName } = req.body;

        // Get the user's email from session
        const userEmail = req.session.authorization.email;

        // Find the user in the database
        const user = await User.findOne({ email: userEmail, role: 'user' });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the playlist
        const playlist = await Playlist.findOne({ name: playlistName, createdBy: user._id });
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Find the song
        const song = await Song.findOne({ name: songName, restricted: 'false' });
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Check if the song already exists in the playlist
        if (playlist.songs.includes(song._id)) {
            return res.status(400).json({ message: 'Song already in playlist' });
        }

        // Add the song to the playlist
        playlist.songs.push(song._id);
        await playlist.save();

        res.status(201).json({ message: 'Song added to playlist successfully', playlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




//to delete songs to a playlist using songName and playlist name
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId; // Import ObjectId from mongoose



exports.deleteSongFromPlaylist = async (req, res) => {
    try {


        // Check if the user is an admin
        if (req.session.authorization.role !== 'user') {
            return res.status(403).json({ error: 'Forbidden', message: 'Only users can delete songs from playlist' });
        }

        const { songId, playlistId } = req.body;


        // Get the user's email from session
        const userEmail = req.session.authorization.email;


        // Find the user in the database
        const user = await User.findOne({ email: userEmail, role: 'user' });
        if (!user) {
            return res.status(404).json({ error: 'User not found', message: 'User not found in the database' });
        }

        console.log("User found:", user);





        // Find the playlist
        const playlist = await Playlist.findOne({ _id: playlistId, createdBy: user._id });
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found', message: 'Playlist not found or does not belong to the user' });
        }



        // Check if the song exists in the playlist
        const songIndex = playlist.songs.findIndex(song => song._id.toString() === songId);
        if (songIndex === -1) {
            return res.status(404).json({ error: 'Song not found', message: 'Song not found in the playlist' });
        }



        // Remove the song from the playlist
        playlist.songs.splice(songIndex, 1);
        await playlist.save();


        res.status(200).json({ message: 'Song deleted from playlist successfully', playlist });
    } catch (error) {
        console.error("Error deleting song from playlist:", error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};


exports.searchSongInPlaylist = async (req, res) => {
    try {
        const { playlistId, songName } = req.body;

        // Get the user's email from session
        const userEmail = req.session.authorization.email;

        // Find the user in the database
        const user = await User.findOne({ email: userEmail, role: 'user' });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the playlist
        const playlist = await Playlist.findOne({ _id: playlistId, createdBy: user._id });
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Find the song
        const song = await Song.findOne({ name: songName });
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Check if the song is in the playlist
        const songIndex = playlist.songs.indexOf(song._id);
        if (songIndex === -1) {
            return res.status(404).json({ message: 'Song not found in playlist' });
        }

        res.status(200).json({ message: 'Song found in playlist', song });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
