const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

router.delete('/delete', playlistController.deleteSongFromPlaylist);
//to get all the playlist
router.post('/searchPlaylist', playlistController.searchSongInPlaylist);
router.get('/', playlistController.getAllPlaylist);

//to add new playlist
router.post('/', playlistController.addPlaylist);
//to delete playlist by Id
router.delete('/:id', playlistController.deletePlaylistById);
//to get playlist for a particular user
router.get('/:id', playlistController.getPlaylistByUserId);
//to add songs to a playlist using songName and playlist name
router.post('/addsong', playlistController.addSongToPlaylist);
//to delete songs to a playlist using songName and playlist name





module.exports = router;
