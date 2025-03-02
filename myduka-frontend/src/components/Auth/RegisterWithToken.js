import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AuthStyles.css';

const RegisterWithToken = () => {
    const { token } = useParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { username, password };
        try {
            const response = await fetch(`http://localhost:5000/register_with_token/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert('Registration successful! You can now log in.');
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed, please try again.');
            }
        } catch (error) {
            setError('Registration failed, please try again.');
        }
    };

    return (
        <div className="auth-page">
            <div className="form-container">
                <h2 className="auth-title">Register</h2>
                <p className="description">Create your account using the token you received.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit" className="button">Register</button>
                </form>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default RegisterWithToken;
