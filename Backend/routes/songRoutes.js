const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');


// GET to search songs by music director, album, or artist
router.get('/search', songController.searchSongs);
// GET all songs
router.get('/', songController.getAllSongs);
//get all songs created by an admin
router.get('/admin', songController.getSongsByAdmin);

// GET a particular song details
router.get('/:id', songController.getSongDetails);

// POST to add a new song
router.post('/', songController.addSong);

// DELETE to delete a song by ID
router.delete('/:id', songController.deleteSong);

router.put('/:id', songController.updateSong);




module.exports = router;
