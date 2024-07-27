import React, { useState } from 'react';

const DeleteSongButton = ({ songId }) => {
    const [errorMessage, setErrorMessage] = useState('');

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/songs/${songId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }, credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete song');
            }

            alert('Song deleted successfully');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message);
            console.error(error);
        }
    };

    return (
        <div>
            <button className='btn btn-danger my-2' onClick={handleDelete}>Delete Song</button>
            {errorMessage && <div>Error: {errorMessage}</div>}
        </div>
    );
};

export default DeleteSongButton;
