import React, { useEffect, useState } from 'react';
import { fetchStores, addStore, updateStore, deleteStore } from '../services/api';
import './mystores.css'; // Import the new CSS file

const MyStores = () => {
  const [stores, setStores] = useState([
    { id: 1, name: 'SuperMart', location: 'Downtown' },
    { id: 2, name: 'QuickStop', location: 'Uptown' },
    { id: 3, name: 'FreshGrocers', location: 'Suburbs' },
  ]);
  const [newStore, setNewStore] = useState({ name: '', location: '' });
  const [editingStore, setEditingStore] = useState(null);

  // Fetch stores when component mounts
  useEffect(() => {
    fetchStores().then((data) => {
      if (data.length > 0) {
        setStores(data);
      }
    });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
  };

  // Add a new store
  const handleAddStore = async () => {
    if (!newStore.name || !newStore.location) return;
    const addedStore = await addStore(newStore);
    setStores([...stores, { ...addedStore, id: stores.length + 1 }]);
    setNewStore({ name: '', location: '' });
  };

  // Handle edit click
  const handleEditClick = (store) => {
    setEditingStore(store);
    setNewStore({ name: store.name, location: store.location });
  };

  // Update store
  const handleUpdateStore = async () => {
    if (!editingStore) return;
    const updatedStore = await updateStore(editingStore.id, newStore);
    setStores(stores.map((store) => (store.id === updatedStore.id ? updatedStore : store)));
    setEditingStore(null);
    setNewStore({ name: '', location: '' });
  };

  // Delete store
  const handleDeleteStore = async (id) => {
    await deleteStore(id);
    setStores(stores.filter((store) => store.id !== id));
  };

  return (
    <div className="store-container">
      <h2>My Stores</h2>

      {/* Add / Edit Store Form */}
      <div className="store-form">
        <h3>{editingStore ? 'Edit Store' : 'Add Store'}</h3>
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          value={newStore.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Store Location"
          value={newStore.location}
          onChange={handleChange}
        />
        <button
          onClick={editingStore ? handleUpdateStore : handleAddStore}
          className={`store-btn ${editingStore ? 'update-btn' : 'add-btn'}`}
        >
          {editingStore ? 'Update Store' : 'Add Store'}
        </button>
      </div>

      {/* Store List */}
      <ul className="store-list">
        {stores.map((store) => (
          <li key={store.id} className="store-item">
            <span className="store-details">{store.name} - {store.location}</span>
            <div className="store-actions">
              <button onClick={() => handleEditClick(store)} className="store-btn edit-btn">
                Edit
              </button>
              <button onClick={() => handleDeleteStore(store.id)} className="store-btn delete-btn">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyStores;
