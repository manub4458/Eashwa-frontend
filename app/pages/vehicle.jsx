"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaBatteryFull, FaCheckCircle, FaExclamationTriangle, FaTractor } from "react-icons/fa";
import Dashboard from "../../components/ui/Dashboard";

const Vehicle = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Updated state name and structure
  const [vehicleData, setVehicleData] = useState({
    currentStock: 0,
    soldStock: 0,
    remainingStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        // Ensure the endpoint URL matches the data structure returned by the API
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/vehicles-stock`);
        const { currentStock, soldStock } = response.data.products[0]; // Adjust the path if necessary
        setVehicleData({
          currentStock,
          soldStock,
          remainingStock: currentStock - soldStock, // Calculate remaining stock
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        setLoading(false);
      }
    };

    fetchVehicleData();
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
        <Dashboard />

        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Vehicle Stock Information</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl">
            {/* Vehicle Stock Information */}
            <div className="relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg rounded-lg p-6 hover:shadow-2xl transform hover:scale-105 transition duration-300">
              <FaTractor className="absolute top-4 right-4 text-4xl opacity-30" />
              <h2 className="text-2xl font-bold mb-4">Vehicle</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">Total Stock:</p>
                  <p className="text-4xl font-bold text-white">{vehicleData.currentStock}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">Sold:</p>
                  <p className="text-4xl font-bold text-red-300">{vehicleData.soldStock}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">Remaining:</p>
                  <p className="text-4xl font-bold text-green-300">{vehicleData.remainingStock}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300">
              <div className="flex items-center space-x-4">
                <FaCheckCircle className="text-green-500 text-4xl" />
                <div>
                  <h3 className="text-2xl font-bold">Total Vehicles Sold</h3>
                  <p className="text-3xl font-semibold text-green-600">
                    {vehicleData.soldStock}
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
                    {vehicleData.remainingStock}
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

export default Vehicle;
