import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import "../styles/Homepage.css";

function Homepage() {
    const [file, setFile] = useState(null);
    const [targetSavings, setTargetSavings] = useState('');
    const [results, setResults] = useState({});
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!file) {
            setError('Please select a file.');
            return;
        }

        if (!targetSavings) {
            setError('Please enter target savings.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('target_savings', targetSavings);

        try {
            const res = await axios.post('/api/v1/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Received response:", res.data);
            setResults(res.data);
        } catch (err) {
            console.error("Error during submission:", err);
            setError('Error processing file');
        }
    };

    return (
        <Layout>
            <div className="homepage">
                <h2>Upload Your Excel File</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        accept=".xls,.xlsx"
                    />
                    <input
                        type="text"
                        placeholder="Target Savings"
                        value={targetSavings}
                        onChange={(e) => setTargetSavings(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <div>
                {Object.keys(results).length > 0 && (
    <div className="results-header">
        <h2>Results</h2>
    </div>
)}

                    {results.pieChart && (
    <div className="section">
        <h3>Spending Categories</h3>
        <img 
            src={`http://localhost:8080${results.pieChart}?t=${new Date().getTime()}`} 
            alt="Spending Categories" 
        />
    </div>
)}
{results.scatterPlot && (
    <div className="section">
        <h3>Frequency vs. Price</h3>
        <img 
            src={`http://localhost:8080${results.scatterPlot}?t=${new Date().getTime()}`} 
            alt="Frequency vs. Price" 
        />
    </div>
)}


{results.savingsRecommendations && (
    <div className="section">
        <h3>Savings Recommendations</h3>
        <table>
            <thead>
                <tr>
                    <th>Transaction Name</th>
                    <th>Category</th>
                    <th>Debited Amount</th>
                    <th>Recommended Savings</th>
                </tr>
            </thead>
            <tbody>
                {results.savingsRecommendations.map((item, index) => (
                    <tr key={index}>
                        <td>{item.TransactionName}</td>
                        <td>{item.Category}</td>
                        <td>{item.DebitedAmount}</td>
                        <td>{item.RecommendedSavings}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
{results.expenseForecast && results.expenseForecast.length > 0 && (
    <div className="section">
        <h3>Predicted Future Expenses</h3>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Month</th>
                    <th>Total Predicted Expense (Next 3 Months)</th>
                </tr>
            </thead>
            <tbody>
                {results.expenseForecast.map((item, index) => (
                    <tr key={index}>
                        <td>{item.Category}</td>
                        <td>{item.Month}</td>
                        <td>₹{item.PredictedExpense}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}



                </div>
            </div>
        </Layout>
    );
}

export default Homepage;
