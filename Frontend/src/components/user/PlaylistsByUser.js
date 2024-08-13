import React, { useState, useEffect } from 'react';
import DeletePlaylistButton from './DeletePlaylist';
import RemoveSongButton from './RemoveSongFromPlaylist';
import SearchSongForm from './SearchInPlaylist';
import PlayerControls from './PlayerControls';
const PlaylistSongs = ({ userId }) => {
    const [playlists, setPlaylists] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch(`http://localhost:5000/playlist/${userId}`, {
                    method: 'GET',
                    credentials: 'include' // Include credentials if needed
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch playlists for the user');
                }

                const data = await response.json();
                setPlaylists(data);
                setErrorMessage('');
            } catch (error) {
                setErrorMessage(error.message);
                console.error(error);
            }
        };

        fetchPlaylists();
    }, [userId, playlists]); // Fetch playlists whenever userId changes
    const songsStyle = {
        padding: '10px',
        backgroundColor: 'red', // Changed background color to red
        borderRadius: '10px',
        width: '100%',
        height: '500px',
        overflow: 'auto'
    };
    const eachPlaylistStyle = {
        padding: '10px',
        backgroundColor: 'blue', // Changed background color to red
        borderRadius: '10px',
        margin: '10px',
        color: 'white'

    };
    const eachSongStyle = {
        padding: '10px',
        backgroundColor: 'white', // Changed background color to red
        borderRadius: '10px',
        margin: '10px',
        color: 'black'

    };
    return (
        <div style={songsStyle}>
            <h2>Playlist Songs</h2>
            {errorMessage && <div>Error: {errorMessage}</div>}
            {playlists.map(playlist => (
                <div key={playlist._id} style={eachPlaylistStyle}>
                    <div><SearchSongForm playlistId={playlist._id} /></div>
                    <h3>{playlist.name}</h3>
                    <ul>
                        {playlist.songs.map(song => (!song.restricted &&
                            <div key={song._id} style={eachSongStyle}>
                                {song.name} - {song.singer}
                                <div><RemoveSongButton playlistId={playlist._id} songId={song._id} /></div>
                            </div>
                        ))}
                    </ul>
                    <PlayerControls />
                    <div><DeletePlaylistButton playlistId={playlist._id} /></div>


                </div>
            ))}
        </div>
    );
};

export default PlaylistSongs;
