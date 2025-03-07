import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AssignInventory = () => {
    const navigate = useNavigate(); // Initialize navigation
    const [clerks, setClerks] = useState([]);
    const [selectedClerk, setSelectedClerk] = useState('');
    const [selectedInventory, setSelectedInventory] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchClerks = async () => {
            try {
                const response = await axios.get('https://my-duka-project-g25b.onrender.com/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setClerks(response.data.clerks);
            } catch (err) {
                setError("Failed to fetch clerks.");
            }
        };

        const fetchInventory = async () => {
            try {
                const response = await axios.get('https://my-duka-project-g25b.onrender.com/inventory', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setInventory(response.data.inventory);
            } catch (err) {
                setError("Failed to fetch inventory.");
            }
        };

        fetchClerks();
        fetchInventory();
    }, []);

    const handleAssign = async () => {
        setError('');
        setSuccess('');

        if (!selectedClerk) {
            setError("Please select a clerk before assigning inventory.");
            return;
        }

        if (selectedInventory.length === 0) {
            setError("Please select at least one inventory item.");
            return;
        }

        try {
            await axios.post('https://my-duka-project-g25b.onrender.com/inventory/assign', {
                clerk_id: parseInt(selectedClerk, 10),
                inventory_ids: selectedInventory
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setSuccess('Inventory assigned successfully');
            setSelectedClerk('');
            setSelectedInventory([]);
            
            // Redirect to inventory after assignment
            setTimeout(() => navigate('/dashboard/inventory'), 1500);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to assign inventory');
        }
    };

    return (
        <div>
            <h2>Assign Inventory to Clerk</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <label>Select Clerk:</label>
            <select value={selectedClerk} onChange={(e) => setSelectedClerk(e.target.value)} required>
                <option value="">Select Clerk</option>
                {clerks.map(clerk => (
                    <option key={clerk.id} value={clerk.id}>{clerk.username}</option>
                ))}
            </select>

            <h3>Select Inventory Items</h3>
            {inventory.map(item => (
                <div key={item.id}>
                    <input
                        type="checkbox"
                        value={item.id}
                        checked={selectedInventory.includes(item.id)}
                        onChange={(e) => {
                            const id = parseInt(e.target.value, 10);
                            setSelectedInventory(prev => 
                                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                            );
                        }}
                    />
                    {item.product_name}
                </div>
            ))}

            <button onClick={handleAssign}>Assign Inventory</button>
        </div>
    );
};

export default AssignInventory;
