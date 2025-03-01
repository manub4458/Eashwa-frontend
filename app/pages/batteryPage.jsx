"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaBatteryFull, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import Dashboard from "../../components/ui/Dashboard";

const BatteryPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [batteryData, setBatteryData] = useState({
    leadAcid: { stock: 0, sold: 0, remaining: 0 },
    lithiumIon: { stock: 0, sold: 0, remaining: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatteryData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/batteries-stock`);
        setBatteryData(response.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching battery data:", error);
        setLoading(false);
      }
    };

    fetchBatteryData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogin = () => {
    localStorage.setItem('token', 'your-auth-token'); // Set your token here
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="w-full p-4 py-6 px-10 flex justify-between items-center shadow-lg">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
          </div>

         
        </header>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        {/* <aside className="w-full md:w-64 bg-[#d86331] text-white p-4">
          <div className="font-bold text-xl mb-6">Your Dashboard</div>
          <nav>
            <ul className="space-y-4">
          <Link href='/'>
          <li className="hover:bg-green-700 p-2 rounded">Overview</li>
          </Link>
              <Link href="/form">
                <li className="hover:bg-green-700 p-2 rounded">Form</li>
              </Link>
              <Link href="/battery">
                <li className="hover:bg-green-700 p-2 rounded">Battery Stock</li>
              </Link>
           <Link href='/charger'>
           <li className="hover:bg-green-700 p-2 rounded">Charger Stock</li>
           </Link>
              <li className="hover:bg-green-700 p-2 rounded">Transactions</li>
            </ul>
          </nav>
        </aside> */}
        <Dashboard/>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Battery Stock Information</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl">
            {/* Lead Acid Battery */}
            <div className="relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg rounded-lg p-6 hover:shadow-2xl transform hover:scale-105 transition duration-300">
              <FaBatteryFull className="absolute top-4 right-4 text-4xl opacity-30" />
              <h2 className="text-2xl font-bold mb-4">Lead Acid Battery</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">Total Stock:</p>
                  <p className="text-4xl font-bold text-white">{batteryData[0].currentStock}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">Sold:</p>
                  <p className="text-4xl font-bold text-[#333333]">{batteryData[0].soldStock}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">Remaining:</p>
                  <p className="text-4xl font-bold text-green-300">{batteryData[0].remainingStock}</p>
                </div>
              </div>
            </div>

            {/* Lithium Ion Battery */}
            <div className="relative bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg rounded-lg p-6 hover:shadow-2xl transform hover:scale-105 transition duration-300">
              <FaBatteryFull className="absolute top-4 right-4 text-4xl opacity-30" />
              <h2 className="text-2xl font-bold mb-4">Lithium-Ion Battery</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">Total Stock:</p>
                  <p className="text-4xl font-bold text-white">{batteryData[1].currentStock}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">Sold:</p>
                  <p className="text-4xl font-bold text-[#333333]">{batteryData[1].soldStock}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">Remaining:</p>
                  <p className="text-4xl font-bold text-green-300">{batteryData[1].remainingStock}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300">
              <div className="flex items-center space-x-4">
                <FaCheckCircle className="text-green-500 text-4xl" />
                <div>
                  <h3 className="text-2xl font-bold">Total Batteries Sold</h3>
                  <p className="text-3xl font-semibold text-green-600">
                    {batteryData[1].soldStock + batteryData[0].soldStock}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300">
              <div className="flex items-center space-x-4">
                <FaExclamationTriangle className="text-yellow-500 text-4xl" />
                <div>
                  <h3 className="text-2xl font-bold">Total Stock Remaining</h3>
                  <p className="text-3xl font-semibold text-blue-600">
                    {batteryData[1].remainingStock + batteryData[0].remainingStock}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BatteryPage;
