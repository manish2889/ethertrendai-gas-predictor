import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const GAIA_AI_ENDPOINT = 'https://gaia.ai.api.endpoint'; // Replace with actual endpoint
const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;

const GasPricePredictor = () => {
  const [currentGasPrice, setCurrentGasPrice] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current gas price
      const gasResponse = await axios.get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`);
      setCurrentGasPrice(parseFloat(gasResponse.data.result.SafeGasPrice));

      // Fetch AI predictions from Gaia network
      // This is a mock response. Replace with actual API call when available.
      const mockPredictions = [25, 30, 28, 32];
      setPredictions(mockPredictions);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Now', '1h', '6h', '12h', '24h'],
    datasets: [
      {
        label: 'Gas Price (Gwei)',
        data: predictions ? [currentGasPrice, ...predictions] : [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gas Price Predictions',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Gas Price (Gwei)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">EtherTrendAI: Gas Price Predictor</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Current Gas Price</h2>
            <p className="text-3xl font-bold text-green-600">{currentGasPrice} Gwei</p>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Gas Price Forecast</h2>
            <div className="bg-gray-50 p-4 rounded-lg" style={{ height: '400px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Detailed Predictions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {predictions && predictions.map((price, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-1">{['1 hour', '6 hours', '12 hours', '24 hours'][index]}</h3>
                  <p className="text-2xl font-bold text-blue-600">{price} Gwei</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GasPricePredictor;
