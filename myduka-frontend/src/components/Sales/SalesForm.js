import React, { useState, useEffect } from "react";

const SalesForm = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("Unauthorized: Please log in.");
          return;
        }

        const response = await fetch("http://127.0.0.1:5000/inventory", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch inventory.");
        }

        const data = await response.json();
        setInventory(data.inventory);
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setMessage("Error loading inventory.");
      }
    };

    fetchInventory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Unauthorized: Please log in.");
      return;
    }

    const saleData = {
      inventory_id: selectedProduct,
      quantity_sold: parseInt(quantity),
      total_price: parseFloat(totalPrice),
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(saleData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        setMessage("Sale recorded successfully!");
        setQuantity("");
        setTotalPrice("");
        setSelectedProduct("");
      } else {
        setMessage(data.message || "Error recording sale.");
      }
    } catch (error) {
      console.error("Error submitting sale:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Record a Sale</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Select Product:
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
            <option value="">--Choose a Product--</option>
            {inventory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.product_name} (Stock: {item.quantity_in_stock})
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Quantity Sold:
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" />
        </label>
        <br />
        <label>
          Total Price:
          <input type="number" step="0.01" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Submit Sale</button>
      </form>
    </div>
  );
};

export default SalesForm;
