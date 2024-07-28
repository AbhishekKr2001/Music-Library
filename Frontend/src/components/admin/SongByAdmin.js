import React, { useState, useEffect } from 'react';
import DeleteSongButton from './DelteASong';
import UpdateSongForm from './UpdateSong';

const SongsByAdmin = () => {
    const [songs, setSongs] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch('http://localhost:5000/songs/admin', {
                    method: 'GET',
                    credentials: 'include'// Send cookies

                });
                if (!response.ok) {
                    throw new Error('Failed to fetch songs');
                }
                const data = await response.json();
                setSongs(data);
                setErrorMessage('');
            } catch (error) {
                setErrorMessage(error.message);
                console.error(error);
            }
        };

        fetchSongs();
    }, [songs]);
    // const [showUpdateForm, setShowUpdateForm] = useState(false);

    // const handleUpdateClick = () => {
    //     setShowUpdateForm(prevState => !prevState);
    // };

    const songsStyle = {
        padding: '10px',
        backgroundColor: 'red', // Changed background color to red
        borderRadius: '10px',
        width: '100%',
        height: '450px',
        overflow: 'auto'
    };
    const eachSongStyle = {
        padding: '10px',
        backgroundColor: 'white', // Changed background color to red
        borderRadius: '10px',
        margin: '10px'

    };
    return (
        <div style={songsStyle}>
            <h2>Songs by Admin</h2>
            {errorMessage && <div>Error: {errorMessage}</div>}
            <ul>
                {songs.map(song => (
                    <li key={song._id} style={eachSongStyle} >
                        <strong>{song.name}</strong> - {song.singer} ({song.restricted ? "Restricted" : "Not restricted for users"})({song.musicDirector}) [{song.albumName}]
                        {/* <button onClick={handleUpdateClick}>
                            {showUpdateForm ? 'Hide Update Form' : 'Update Song'}
                        </button> */}
                        <UpdateSongForm songId={song._id} />
                        <DeleteSongButton songId={song._id} />
                    </li>
                ))}
            </ul>
        </div>

    );
};

export default SongsByAdmin;
