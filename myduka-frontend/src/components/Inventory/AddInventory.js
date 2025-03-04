import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './inventory.css'; // Import the CSS

const AddInventory = () => {
   const navigate = useNavigate(); 
   const [productName, setProductName] = useState('');
   const [quantityReceived, setQuantityReceived] = useState('');
   const [quantityInStock, setQuantityInStock] = useState('');
   const [quantitySpoilt, setQuantitySpoilt] = useState('');
   const [buyingPrice, setBuyingPrice] = useState('');
   const [sellingPrice, setSellingPrice] = useState('');
   const [paymentStatus, setPaymentStatus] = useState('');
   const [supplier, setSupplier] = useState('');
   const [storeId, setStoreId] = useState('');  // Store ID now an input field
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

   const handleSubmit = async (e) => {
       e.preventDefault();
       setError('');
       setSuccess('');

       try {
           const response = await axios.post('https://my-duka-project-g25b.onrender.com/inventory', {
               product_name: productName,
               quantity_received: quantityReceived,
               quantity_in_stock: quantityInStock,
               quantity_spoilt: quantitySpoilt,
               buying_price: buyingPrice,
               selling_price: sellingPrice,
               payment_status: paymentStatus,
               supplier: supplier,
               store_id: storeId  
           }, {
               headers: {
                   Authorization: `Bearer ${localStorage.getItem('token')}`
               }
           });

           setSuccess(response.data.message);

           // Redirect to the inventory list after successful addition
           navigate('/dashboard/inventory');
       } catch (error) {
           setError(error.response ? error.response.data.message : 'Failed to add inventory');
       }
   };

   return (
       <div className="container">
           <h2>Add Inventory Item</h2>
           {error && <div className="error-message">{error}</div>}
           {success && <div className="success-message">{success}</div>}
           <form onSubmit={handleSubmit}>
               <input type="text" placeholder="Enter Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} required />
               <input type="number" placeholder="Enter Quantity Received" value={quantityReceived} onChange={(e) => setQuantityReceived(e.target.value)} required />
               <input type="number" placeholder="Enter Quantity In Stock" value={quantityInStock} onChange={(e) => setQuantityInStock(e.target.value)} required />
               <input type="number" placeholder="Enter Quantity Spoilt" value={quantitySpoilt} onChange={(e) => setQuantitySpoilt(e.target.value)} required />
               <input type="number" placeholder="Enter Buying Price" value={buyingPrice} onChange={(e) => setBuyingPrice(e.target.value)} required />
               <input type="number" placeholder="Enter Selling Price" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} required />
               <input type="text" placeholder="Enter Payment Status" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} required />
               <input type="text" placeholder="Enter Supplier Name" value={supplier} onChange={(e) => setSupplier(e.target.value)} required />
               <input type="number" placeholder="Enter Store ID" value={storeId} onChange={(e) => setStoreId(e.target.value)} required />
               <button type="submit">Add Inventory</button>
           </form>
       </div>
   );
};

export default AddInventory;
