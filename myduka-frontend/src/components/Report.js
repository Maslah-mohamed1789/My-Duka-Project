import React, { useEffect, useState } from 'react';
import { fetchReportsAPI } from '../services/reportService';

const Report = () => {
    const [report, setReport] = useState({});
    const [period, setPeriod] = useState('monthly');

    useEffect(() => {
        fetchReportsAPI(period).then(setReport);
    }, [period]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-3">Reports</h2>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="border p-2 mb-2">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
            </select>
            <pre className="bg-gray-200 p-3 rounded">{JSON.stringify(report, null, 2)}</pre>
        </div>
    );
};

export default Report;
