import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

const MerchantReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://my-duka-project-g25b.onrender.com/report/merchant_reports", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setReports(data.merchant_reports || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Merchant Reports Dashboard</h2>
      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Sales per Store */}
          <div className="border border-gray-300 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Total Sales per Store</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reports}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="store_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Performance */}
          <div className="border border-gray-300 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reports.flatMap((store) => store.top_products)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_sold" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={() => window.location.reload()}
      >
        Refresh Reports
      </button>
    </div>
  );
};

export default MerchantReports;