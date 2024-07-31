import React from 'react';
import { useNavigate } from 'react-router-dom';
const LogoutButton = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to logout');
            }
            localStorage.removeItem('token');
            localStorage.removeItem('userId');

            alert('User logged out successfully');
            navigate("/");
            window.history.replaceState(null, '', '/');
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    };

    return (
        <div>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default LogoutButton;
