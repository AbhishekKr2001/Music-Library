import React, { useState } from 'react';

const DeletePlaylistButton = ({ playlistId }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/playlist/${playlistId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            setSuccessMessage('Playlist deleted successfully');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage('');
        }
    };

    return (
        <div>
            <button className="btn btn-danger" onClick={handleDelete}>Delete Playlist</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
};

export default DeletePlaylistButton;
