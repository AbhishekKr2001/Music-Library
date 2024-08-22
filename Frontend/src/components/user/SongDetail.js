import React, { useState } from 'react';

const GetSongDetailsButton = ({ songId }) => {
    const [songDetails, setSongDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDetails, setShowDetails] = useState(false); // State to toggle details

    const handleGetSongDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/songs/${songId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch song details');
            }

            setSongDetails(data);
            setErrorMessage('');
            setShowDetails(true); // Show details on successful fetch
        } catch (error) {
            setErrorMessage(error.message);
            console.error(error);
        }
    };

    const handleToggleDetails = () => {
        setShowDetails(!showDetails); // Toggle showDetails state
    };

    return (
        <div>
            <button className='btn btn-info' onClick={handleGetSongDetails}>Get Song Details</button>
            {errorMessage && <div>Error: {errorMessage}</div>}
            {showDetails && songDetails && ( // Only show details if showDetails is true and songDetails is not null
                <div>
                    <h3>Song Details</h3>
                    <p><strong>Song:</strong> {songDetails.name}</p>
                    <p><strong>Singer:</strong> {songDetails.singer}</p>
                    <p><strong>Music Director:</strong> {songDetails.musicDirector}</p>
                    <p><strong>Album:</strong> {songDetails.albumName}</p>
                    <p><strong>Release Date:</strong> {songDetails.releaseDate}</p>
                </div>
            )}
            {showDetails && (
                <button className='btn btn-info' onClick={handleToggleDetails}>Hide Details</button>
            )}
        </div>
    );
};

export default GetSongDetailsButton;
