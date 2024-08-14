import React, { useState } from 'react';

const RemoveSongButton = ({ songId, playlistId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClick = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/playlist/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ songId, playlistId }),
                credentials: 'include'
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button className="btn btn-danger" onClick={handleClick} disabled={loading}>
                {loading ? 'Removing...' : 'Remove Song'}
            </button>
        </div>
    );
};

export default RemoveSongButton;
