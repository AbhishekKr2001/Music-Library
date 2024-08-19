import React, { useState } from 'react';

const SearchSongs = () => {
    const [searchQuery, setSearchQuery] = useState({
        musicDirector: '',
        albumName: '',
        singer: ''
    });
    const [searchResult, setSearchResult] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const queryString = new URLSearchParams(searchQuery).toString();
            const response = await fetch(`http://localhost:5000/songs/search?${queryString}`, {
                method: 'GET',
                credentials: 'include' // Send cookies
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch search results');
            }

            setSearchResult(data);
            setErrorMessage('');

            // Reset the search query to empty values
            setSearchQuery({
                musicDirector: '',
                albumName: '',
                singer: ''
            });

        } catch (error) {
            setErrorMessage(error.message);
            console.error(error);
        }
    };

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
    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Changed to space-between
        padding: '10px'
    };

    return (
        <div style={songsStyle}>
            <h2>Search Songs</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={{ padding: '10px' }}>
                    <label>Music Director:</label>
                    <input
                        type="text"
                        name="musicDirector"
                        value={searchQuery.musicDirector}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ padding: '10px' }}>
                    <label>Album Name:</label>
                    <input
                        type="text"
                        name="albumName"
                        value={searchQuery.albumName}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ padding: '10px' }}>
                    <label>Singer:</label>
                    <input
                        type="text"
                        name="singer"
                        value={searchQuery.singer}
                        onChange={handleChange}
                    />
                </div>
                <button className='btn btn-primary' type="submit">Search</button>
            </form>

            {errorMessage && <div>Error: {errorMessage}</div>}

            <div >
                <h2>Search Results</h2>
                <ul>
                    {searchResult.map(song => (
                        <li key={song._id} style={eachSongStyle}>
                            <strong>{song.name}</strong> - {song.singer}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SearchSongs;
