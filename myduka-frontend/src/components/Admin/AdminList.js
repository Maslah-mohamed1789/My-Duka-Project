// src/components/Admin/AdminList.js
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

const AdminList = () => {
    const [admins, setAdmins] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get('https://my-duka-project-g25b.onrender.com/admins', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage
                }
            });
            setAdmins(response.data.admins); // Corrected to use 'admins'
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // If unauthorized, log out the user
                dispatch(logout());
            } else {
                console.error('Error fetching admins:', error);
            }
        }
    };

    const handleDeactivate = async (id) => {
        try {
            await axios.patch(`https://my-duka-project-g25b.onrender.com/deactivate_admin/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchAdmins(); // Refresh the list after deactivation
        } catch (error) {
            console.error('Error deactivating admin:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this admin?')) {
            try {
                await axios.delete(`https://my-duka-project-g25b.onrender.com/delete_admin/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                fetchAdmins(); // Refresh the list after deletion
            } catch (error) {
                console.error('Error deleting admin:', error);
            }
        }
    };

    return (
        <div>
            <h2>Admin List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.length > 0 ? (
                        admins.map(admin => (
                            <tr key={admin.id}>
                                <td>{admin.id}</td>
                                <td>{admin.username}</td>
                                <td>{admin.email}</td>
                                <td>
                                    <button onClick={() => handleDeactivate(admin.id)}>Deactivate</button>
                                    <button onClick={() => handleDelete(admin.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No admins found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminList;