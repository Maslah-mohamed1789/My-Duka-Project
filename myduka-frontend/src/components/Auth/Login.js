import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css';

const Login = () => {zaaaa
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password };
    try {
        const response = await dispatch(login(credentials)).unwrap();
        localStorage.setItem('token', response.access_token); // Store the token correctly
        navigate('/dashboard'); // Navigate to the dashboard route
    } catch (error) {
        setError(error.message || 'Login failed, please try again.');
    }
};

return (
    <div className="auth-page">
        <div className="form-container">
            <h2 className="auth-title">Login</h2>
            <p className="description">Access your account to manage your dashboard.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" className="button">Login</button>
            </form>
            {error && <div className="error-message">{error}</div>}
        </div>
    </div>
);
};

export default Login;