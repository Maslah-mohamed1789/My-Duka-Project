import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css';

const RegisterClerk = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); 

        try {
            const response = await fetch('http://localhost:5000/register_clerk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/dashboard/admin');
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className="auth-page">
            <div className="form-container">
                <h2 className="auth-title">Register Clerk</h2>
                <p className="description">Create a new clerk account.</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <button type="submit">Register Clerk</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterClerk;
