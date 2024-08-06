import React, { useState, useEffect } from 'react';
import GetSongDetailsButton from './SongDetail';

const SongList = () => {
    const [songs, setSongs] = useState([]);


    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch('http://localhost:5000/songs', {
                    method: 'GET',
                    credentials: 'include' // Send cookies
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch songs');
                }
                const data = await response.json();
                // Set previous count before updating songs
                setSongs(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSongs();
    }, [songs]);



    const songsStyle = {
        padding: '10px',
        backgroundColor: 'red', // Changed background color to red
        borderRadius: '10px',
        width: '100%',
        height: '500px',
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
            <h2>Song List</h2>
            <ul>
                {songs.map(song => (
                    <li key={song._id} style={eachSongStyle}>
                        <strong>{song.name}</strong> - {song.singer}<GetSongDetailsButton songId={song._id} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SongList;
