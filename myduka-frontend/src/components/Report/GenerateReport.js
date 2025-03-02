import React, { useState } from 'react';
import axios from 'axios';

const GenerateReport = () => {
    const [reportType, setReportType] = useState('Sales');
    const [storeId, setStoreId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleGenerateReport = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await axios.post('/api/reports', { report_type: reportType, store_id: storeId });
            setSuccessMessage(response.data.message);
        } catch (err) {
            setError('Failed to generate report. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Generate Report</h2>
            <div>
                <label>Report Type</label>
                <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option value="Sales">Sales</option>
                    <option value="Stock">Stock</option>
                </select>
            </div>
            <div>
                <label>Store ID</label>
                <input
                    type="number"
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    placeholder="Enter store ID"
                />
            </div>
            <button onClick={handleGenerateReport} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Report'}
            </button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </div>
    );
};

export default GenerateReport;
