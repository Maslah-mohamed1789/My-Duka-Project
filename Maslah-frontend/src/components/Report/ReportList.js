import React from 'react';
import SalesGraph from './SalesGraph';  // Import SalesGraph component

const ReportList = ({ storeId }) => {
    return (
        <div>
            <h2>Store Performance Report</h2>
            <SalesGraph storeId={storeId} />
        </div>
    );
};

export default ReportList;