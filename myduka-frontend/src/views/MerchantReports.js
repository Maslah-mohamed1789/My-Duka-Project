import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './merchantreports.css'; // Import styles

const MerchantReports = () => {
  const [report, setReport] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [error, setError] = useState('');

  // Example data for UI preview before fetching
  const exampleReports = {
    weekly: {
      total_sales: "$2,500",
      total_orders: 45,
      total_products_sold: 150,
      total_revenue: "$8,900",
    },
    monthly: {
      total_sales: "$10,500",
      total_orders: 180,
      total_products_sold: 620,
      total_revenue: "$35,200",
    },
    annual: {
      total_sales: "$126,000",
      total_orders: 2200,
      total_products_sold: 7500,
      total_revenue: "$420,000",
    },
  };

  // Fetch reports when period changes
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get(`/report?period=${period}`);
        setReport(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch reports.');
        setReport(exampleReports[period]); // Show example data in case of an error
      }
    };
    fetchReports();
  }, [period]);

  return (
    <div className="report-container">
      <h2>Generate Reports</h2>

      {/* Dropdown for selecting period */}
      <select onChange={(e) => setPeriod(e.target.value)} className="report-select">
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="annual">Annual</option>
      </select>

      {/* Display Report */}
      <div className="report-display">
        {error ? <p className="error-text">{error}</p> : null}
        
        {report && (
          <div className="report-summary">
            <h3>{period.charAt(0).toUpperCase() + period.slice(1)} Report</h3>
            <p><strong>Total Sales:</strong> {report.total_sales}</p>
            <p><strong>Total Orders:</strong> {report.total_orders}</p>
            <p><strong>Products Sold:</strong> {report.total_products_sold}</p>
            <p><strong>Total Revenue:</strong> {report.total_revenue}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantReports;
