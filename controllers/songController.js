const Song = require('../models/song');
const User = require('../models/user');
const Playlist = require('../models/playlist'); // Import the Playlist model
const nodemailer = require('nodemailer');

// Controller to get all songs
exports.getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find({ restricted: false });
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get all songs created by an admin
exports.getSongsByAdmin = async (req, res) => {
    // console.log("till here");
    try {

        const adminEmail = req.session.authorization.email;

        if (!adminEmail) {
            return res.status(401).json({ message: "Unauthorized: Admin email not provided" });
        }

        // Find the admin in the database
        const admin = await User.findOne({ email: adminEmail, role: 'admin' });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const userId = admin._id;
        const songs = await Song.find({ createdBy: userId });
        res.json(songs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};





// GET a particular song details
exports.getSongDetails = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }
        res.json(song);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET to search songs by music director, album, or singer
exports.searchSongs = async (req, res) => {
    try {
        const { musicDirector, albumName, singer } = req.query;
        console.log(req.query);
        const query = { restricted: false }; // Adding the condition for restricted field
        if (musicDirector) {
            query.musicDirector = { $regex: new RegExp(musicDirector, "i") }; // Case-insensitive search
        }
        if (albumName) {
            query.albumName = { $regex: new RegExp(albumName, "i") };
        }
        if (singer) {
            query.singer = { $regex: new RegExp(singer, "i") };
        }
        console.log(query);
        const songs = await Song.find(query);

        if (songs.length === 0) {
            return res.status(404).json({ message: 'No matching songs found' });
        }
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




/*{

"name":"dopeSHOPE", "singer":"HONEYsINGH", "musicDirector":"HONEYsINGH", "albumName":"HIPhOP"
}*/
// POST to add a new song





exports.addSong = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.session.authorization.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admin can add new songs' });
        }

        const { name, singer, musicDirector, albumName, restricted } = req.body;

        // Get the admin's email from session
        const adminEmail = req.session.authorization.email;

        // Find the admin in the database
        const admin = await User.findOne({ email: adminEmail, role: 'admin' });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Assuming you have the user ID in req.user
        const createdBy = admin._id;

        // Create the song object with the 'restricted' field from req.body
        const song = new Song({ name, singer, musicDirector, albumName, createdBy, restricted });

        await song.save();

        // Send email to all users with role 'user'
        sendEmailToUsers();

        res.status(201).json({ message: 'Song added successfully', song });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to send email to all users with role 'user'
async function sendEmailToUsers() {
    try {
        // Find all users with role 'user'
        const users = await User.find({ role: 'user' });

        // Create a transporter using SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'abhishek17jmt@gmail.com',
                pass: 'ngilediojfribvue'
            }
        });

        // Loop through each user and send email
        users.forEach(user => {
            let mailOptions = {
                from: 'abhishek17jmt@gmail.com',
                to: user.email,
                subject: 'New Song Added!',
                text: 'Hi ' + user.email + ', a new song has been added. Check it out!',
                html: '<p>Hi ' + user.email + ', a <b>new song</b> has been added. Check it out!</p>'
            };

            // Send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email to ' + user.email + ':', error);
                } else {
                    console.log('Email sent to ' + user.email + ':', info.messageId);
                }
            });
        });
    } catch (error) {
        console.log('Error sending emails:', error);
    }
}







// DELETE to delete a song by ID



exports.deleteSong = async (req, res) => {
    try {
        const songId = req.params.id;
        const adminEmail = req.session.authorization.email;

        // Find the admin in the database
        const admin = await User.findOne({ email: adminEmail, role: 'admin' });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const userId = admin._id;

        // Find the song
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Check if the user is the creator of the song
        if (song.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You are not the creator of this song' });
        }

        // Delete the song
        await Song.findByIdAndDelete(songId);

        // Remove the song from all playlists
        await Playlist.updateMany(
            { songs: songId },
            { $pull: { songs: songId } }
        );

        res.json({ message: 'Song deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// PUT to update a song by ID
exports.updateSong = async (req, res) => {
    try {
        const songId = req.params.id;
        const adminEmail = req.session.authorization.email;

        // Find the admin in the database
        const admin = await User.findOne({ email: adminEmail, role: 'admin' });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Find the song in the database
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Check if the admin is the creator of the song
        if (song.createdBy.toString() !== admin._id.toString()) {
            return res.status(403).json({ message: 'Forbidden: You are not the creator of this song' });
        }

        // Update song details
        const { name, singer, musicDirector, albumName, restricted } = req.body;

        if (name) song.name = name;
        if (singer) song.singer = singer;
        if (musicDirector) song.musicDirector = musicDirector;
        if (albumName) song.albumName = albumName;
        if (restricted) song.restricted = restricted;

        await song.save();

        res.json({ message: 'Song updated successfully', song });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

