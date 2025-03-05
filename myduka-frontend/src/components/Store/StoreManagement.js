import React, { useState, useEffect } from "react";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all stores
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Unauthorized: Please log in.");
        return;
      }

      const response = await fetch("https://my-duka-project-g25b.onrender.com/store/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stores");
      }

      const data = await response.json();
      setStores(data);
    } catch (error) {
      setMessage("Error fetching stores");
    }
  };

  // Create a new store
  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Unauthorized: Please log in.");
        return;
      }

      const response = await fetch("https://my-duka-project-g25b.onrender.com/store/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, location }),
      });

      if (!response.ok) {
        throw new Error("Failed to create store");
      }

      setMessage("Store created successfully!");
      setName("");
      setLocation("");
      fetchStores(); // Refresh store list
    } catch (error) {
      setMessage("Error creating store");
    }
  };

  // Delete store
  const handleDeleteStore = async (storeId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Unauthorized: Please log in.");
        return;
      }

      const response = await fetch(`https://my-duka-project-g25b.onrender.com/store/stores/${storeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete store");
      }

      setMessage("Store deleted successfully!");
      fetchStores(); // Refresh store list
    } catch (error) {
      setMessage("Error deleting store");
    }
  };

  return (
    <div>
      <h2>Store Management</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleCreateStore}>
        <label>Store Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <br />
        <label>Location:</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <br />
        <button type="submit">Create Store</button>
      </form>

      <h3>My Stores</h3>
      <ul>
        {stores.map((store) => (
          <li key={store.id}>
            {store.name} - {store.location}
            <button onClick={() => handleDeleteStore(store.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreManagement;
