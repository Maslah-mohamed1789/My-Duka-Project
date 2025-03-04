import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserManagement.css';  // Import the CSS file for styling

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    // Fetch users (only Clerks for now, as Admin is managing them)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://my-duka-project-g25b.onrender.com/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`  // Use the correct key for the token
                    }
                });
                // Check if response.data.clerks is an array
                if (Array.isArray(response.data.clerks)) {
                    setUsers(response.data.clerks);  // Assuming your API returns an array of clerks
                } else {
                    setError('Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching users:', error.response ? error.response.data : error.message);
                setError('Failed to fetch users. Please try again.');
            }
        };
        fetchUsers();
    }, []);

    // Delete user (clerk)
    const deleteUser  = async (id) => {
        try {
            await axios.delete(`https://my-duka-project-g25b.onrender.com/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`  // Use the correct key for the token
                }
            });
            setUsers(users.filter(user => user.id !== id));  // Remove user from the state
        } catch (error) {
            console.error('Error deleting user:', error.response ? error.response.data : error.message);
            setError('Failed to delete user. Please try again.');
        }
    };

    return (
        <div className="user-management-container">
            <h2>User Management</h2>
            {error && <div className="error-message">{error}</div>}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
