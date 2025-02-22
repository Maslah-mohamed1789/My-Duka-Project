import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-lg font-bold">MyDuka</h1>
            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                        <span>Welcome, {user.username}</span>
                        <Link to="/dashboard">Dashboard</Link>
                        {user.role === 'admin' && <Link to="/admin">Admin</Link>}
                        {user.role === 'merchant' && <Link to="/merchant">Merchant</Link>}
                        {user.role === 'clerk' && <Link to="/clerk">Clerk</Link>}
                        <button onClick={onLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
                    </>
                ) : (
                    <Link to="/">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
