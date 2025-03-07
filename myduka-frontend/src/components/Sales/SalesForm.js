import React, { useState, useEffect } from "react";
import "./SalesForm.css"; // Import the CSS file

const SalesForm = () => {
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]); // State to hold sales data
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [message, setMessage] = useState("");

  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("Unauthorized: Please log in.");
          return;
        }

        const response = await fetch("https://my-duka-project-g25b.onrender.com/inventory", {
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

  // Fetch sales data
  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Unauthorized: Please log in.");
        return;
      }

      const response = await fetch("https://my-duka-project-g25b.onrender.com/sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sales.");
      }

      const data = await response.json();
      setSales(data.sales); // Set the sales data
    } catch (err) {
      console.error("Error fetching sales:", err);
      setMessage("Error loading sales.");
    }
  };

  // Call fetchSales when the component mounts
  useEffect(() => {
    fetchSales();
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
      const response = await fetch("https://my-duka-project-g25b.onrender.com/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(saleData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Sale recorded successfully!");
        setQuantity("");
        setTotalPrice("");
        setSelectedProduct("");
        // Refetch sales data here to update the list
        fetchSales();
      } else {
        setMessage(data.message || "Error recording sale.");
      }
    } catch (error) {
      console.error("Error submitting sale:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="sales-container">
      <h2>Record a Sale</h2>
      {message && <div className="message">{message}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <label>Select Product:</label>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
            <option value="">--Choose a Product--</option>
            {inventory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.product_name} (Stock: {item.quantity_in_stock})
              </option>
            ))}
          </select>

          <label>Quantity Sold:</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" />

          <label>Total Price:</label>
          <input type="number" step="0.01" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} required />

          <button type="submit">Submit Sale</button>
        </form>
      </div>

      {/* Display Sales Data */}
      <h3>Sales Records</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Quantity Sold</th>
              <th>Total Price</th>
              <th>Sale Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.inventory_id}</td>
                <td>{sale.quantity_sold}</td>
                <td>{sale.total_price}</td>
                <td>{new Date(sale.sale_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesForm;
