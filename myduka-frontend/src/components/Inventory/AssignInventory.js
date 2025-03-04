// src/components/Inventory/AssignInventory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignInventory = () => {
    const [clerks, setClerks] = useState([]);
    const [selectedClerk, setSelectedClerk] = useState('');
    const [selectedInventory, setSelectedInventory] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchClerks = async () => {
            // Fetch clerks from the backend
            // Assuming you have an endpoint to get clerks
            const response = await axios.get('https://my-duka-project-g25b.onrender.com/clerks', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setClerks(response.data.clerks);
        };

        const fetchInventory = async () => {
            const response = await axios.get('https://my-duka-project-g25b.onrender.com/inventory', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setInventory(response.data.inventory);
        };

        fetchClerks();
        fetchInventory();
    }, []);

    const handleAssign = async () => {
      try {
          await axios.post('https://my-duka-project-g25b.onrender.com/inventory/assign', {
              clerk_id: selectedClerk,
              inventory_ids: selectedInventory
          }, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
          setSuccess('Inventory assigned successfully');
          setSelectedClerk('');
          setSelectedInventory([]);
      } catch (error) {
          console.error('Error details:', error); // Log the error details
          setError(error.response ? error.response.data.message : 'Failed to assign inventory');
      }
  };

    return (
        <div>
            <h2>Assign Inventory to Clerk</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
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
                            const id = parseInt(e.target.value);
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