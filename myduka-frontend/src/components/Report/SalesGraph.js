import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';  // Importing Line and Bar from react-chartjs-2
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const SalesGraph = ({ storeId }) => {
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axios.get(`https://my-duka-project-g25b.onrender.com/store_sales_data/${storeId}`);
                setGraphData(response.data);
            } catch (err) {
                setError('Failed to load graph data');
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, [storeId]);

    if (loading) return <p>Loading graph...</p>;
    if (error) return <p>{error}</p>;

    // Data for the Line Chart
    const lineChartData = {
        labels: graphData.labels,  // Date labels
        datasets: [
            {
                label: 'Total Sales',
                data: graphData.data,  // Sales data
                fill: false,
                borderColor: '#4bc0c0',
                tension: 0.1
            }
        ]
    };

    // Data for the Bar Chart (if you want to use a bar graph)
    const barChartData = {
        labels: graphData.labels,
        datasets: [
            {
                label: 'Total Sales',
                data: graphData.data,
                backgroundColor: '#ff6384',
                borderColor: '#ff6384',
                borderWidth: 1
            }
        ]
    };

    return (
        <div>
            <h2>Sales Performance</h2>
            <div>
                <h3>Line Graph (Sales over time)</h3>
                <Line data={lineChartData} options={{ responsive: true }} />
            </div>
            <div>
                <h3>Bar Graph (Sales per day)</h3>
                <Bar data={barChartData} options={{ responsive: true }} />
            </div>
        </div>
    );
};

export default SalesGraph;
