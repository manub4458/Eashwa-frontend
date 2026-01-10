"use client";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Sidebar from "../../components/ui/Dashboard";
import axios from 'axios';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chargerData, setChargerData] = useState({
    standardCharger: { stock: 0, sold: 0, remaining: 0 },
    fastCharger: { stock: 0, sold: 0, remaining: 0 },
  });
  const [batteryData, setBatteryData] = useState({
    leadAcid: { stock: 0, sold: 0, remaining: 0 },
    lithiumIon: { stock: 0, sold: 0, remaining: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatteryData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/batteries-stock`);
        setBatteryData(response.data.products); // Assuming data is structured as { products: [ { month: 'Jan', leadAcid: { stock: 0, ... }, lithiumIon: { stock: 0, ... } }, ... ]}
      } catch (error) {
        console.error("Error fetching battery data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchChargerData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/chargers-stock`);
        setChargerData(response.data.products); // Assuming similar structure as battery data
      } catch (error) {
        console.error("Error fetching charger data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatteryData();
    fetchChargerData();
  }, []);
  // Check login status from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set to true if token exists
  }, []);

  const handleLogin = () => {
    localStorage.setItem('token', 'your-auth-token'); // Set your token here
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.reload(); // This will refresh the page
  };

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'Lead Acid Battery', data: [200, 250, 300, 280, 320], backgroundColor: 'rgba(54, 162, 235, 0.6)' },
      { label: 'Lithium Ion Battery', data: [150, 120, 180, 160, 200], backgroundColor: 'rgba(75, 192, 192, 0.6)' },
      { label: 'Lead Acid Charger', data: [200, 250, 300, 280, 320], backgroundColor: 'rgba(255, 140, 0, 0.6)' },
      { label: 'Lithium Ion Charger', data: [100, 90, 130, 110, 140], backgroundColor: 'rgba(255, 206, 86, 0.6)' },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="w-full p-4 py-6 px-10 flex justify-between items-center shadow-lg">
       
         <div className="flex items-center space-x-3">
         <Link href='/'>
            <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
            </Link>
          </div>
      

          <div className="bg-white text-black p-2 rounded shadow-sm flex items-center">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-white bg-red-600 px-3 py-1 rounded">Logout</button>
            ) : (
              <Link href='/login'>
                <button onClick={handleLogin} className="text-white bg-green-600 px-3 py-1 rounded">Login</button>
              </Link>
            )}
          </div>
        </header>

        <div className="flex flex-col md:flex-row flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <h1 className="text-2xl font-bold">Battery Stock Overview</h1>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Lead Acid Battery Stock</h2>
                 <h2 className="text-lg font-semibold">Lithium Ion Battery Stock</h2>
                <p className="text-3xl font-bold text-green-600">
                  {batteryData && batteryData[0] ? batteryData[0].remainingStock : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Available</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Lithium Ion Battery Stock</h2>
                <p className="text-3xl font-bold text-green-600">
                  {batteryData && batteryData[1] ? batteryData[1].remainingStock : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Lead Acid Charger Stock</h2>
                <p className="text-3xl font-bold text-green-600">
                  {
                    chargerData && chargerData[0] ? chargerData[0].remainingStock : 'N/A'
                  }
                </p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Lithium Ion Charger Stock</h2>
                <p className="text-3xl font-bold text-green-600">
                  {
                    chargerData && chargerData[1] ? chargerData[1].remainingStock : 'N/A'
                  }
                </p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Shortage stock</h2>
                <p className="text-3xl font-bold text-green-600">
0
                </p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
            </section>

            <section className="mt-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Monthly Stock Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xl font-bold">Total Batteries Sold</p>
                    {/* <p className="text-2xl font-semibold text-green-600">
  {batteryData[1].leadAcid && batteryData[0].lithiumIon 
    ? (batteryData[1].leadAcid.sold || 0) + (batteryData[0].lithiumIon.sold || 0) 
    : 0}
</p> */}

                  </div>
                  <div>
                    <p className="text-xl font-bold">Total Chargers Sold</p>
                    {/* <p className="text-2xl font-semibold text-green-600">
                      {((chargerData.standardCharger && chargerData.standardCharger.sold) || 0) +
                        (chargerData.fastCharger && chargerData.fastCharger.sold || 0)}
                    </p> */}

                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white p-6 rounded-lg shadow" style={{ height: '400px' }}>
                <Bar data={data} options={options} height={null} width={null} />
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
