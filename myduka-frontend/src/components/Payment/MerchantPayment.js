import React, { useEffect, useState } from "react";

const MerchantPayments = () => {
  const [payments, setPayments] = useState([]);
  const [inventoryId, setInventoryId] = useState("");
  const [status, setStatus] = useState("Pending");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch merchant payments
  useEffect(() => {
    fetch("https://my-duka-project-g25b.onrender.com/payment", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPayments(data.payments || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching payments:", error);
        setLoading(false);
      });
  }, []);

  // Process a new payment
  const handlePayment = (e) => {
    e.preventDefault();

    fetch("https://my-duka-project-g25b.onrender.com/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ inventory_id: inventoryId, status, amount: parseFloat(amount) }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        window.location.reload(); // Refresh payments
      })
      .catch((error) => console.error("Error processing payment:", error));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Merchant Payments</h2>

      {/* Payment Form */}
      <form onSubmit={handlePayment} className="mb-4">
        <input
          type="number"
          placeholder="Inventory ID"
          value={inventoryId}
          onChange={(e) => setInventoryId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        <button type="submit">Process Payment</button>
      </form>

      {/* Payments List */}
      {loading ? (
        <p>Loading payments...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Inventory ID</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.inventory_id}</td>
                <td>{payment.status}</td>
                <td>${payment.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MerchantPayments;
