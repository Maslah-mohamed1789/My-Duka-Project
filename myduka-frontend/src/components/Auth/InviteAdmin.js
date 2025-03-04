import React, { useState } from 'react';
import './AuthStyles.css';

const InviteAdmin = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Assuming you store the token in local storage

        try {
            const response = await fetch('https://my-duka-project-g25b.onrender.com/invite_admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Invitation sent successfully!');
            } else {
                alert(data.message || 'Failed to send invitation');
            }
        } catch (error) {
            console.error('Invitation failed:', error);
        }
    };

    return (
        <div className="auth-page">
            <div className="form-container">
                <h2 className="auth-title">Invite Admin</h2>
                <p className="description">Enter the email address to invite a new admin.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Admin Email"
                        required
                    />
                    <button type="submit">Invite Admin</button>
                </form>
            </div>
        </div>
    );
};

export default InviteAdmin;
