import Head from 'next/head'
import React from 'react'
import { FaWarehouse, FaUsers } from "react-icons/fa";
import Link from 'next/link';  // Import Link from Next.js

const Card = () => {
  return (
    <>
      <Head>
        <title>E-Ashwa Dashboard</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 flex items-center justify-center">

        <div className="container mx-auto p-6">
          
          {/* Logo Section */}
          <div className="absolute top-6 left-6">
            <img src="/logo.png" alt="E-Ashwa Logo" className="w-32 h-auto" />
          </div>

          {/* Header Section - Centered */}
          <div className="w-full text-center mt-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-800">Welcome to E-Ashwa</h1>
          </div>

          {/* Main Content Section */}
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-12 mx-auto mt-12 px-6">
            
            {/* E-Ashwa Plant Card */}
           <Link href='/plant'>
           <div className="w-full h-[500px] p-10 bg-white rounded-xl shadow-lg border border-gray-300 text-gray-800 flex flex-col items-center justify-center space-y-6">
              <FaWarehouse className="text-6xl mb-4 text-blue-600" />
              <h1 className="text-3xl font-semibold mb-4">E-Ashwa Plant</h1>
              <p className="text-xl mb-6 text-gray-500">Manage your stock of Batteries, Vehicles, and Chargers.</p>

              {/* Checklist for Plant */}
              <div className="space-y-4 mb-6 text-gray-600">
                <div className="flex items-center">
                  <FaWarehouse className="text-xl text-gray-500" />
                  <span className="ml-2">Batteries Stock Management</span>
                </div>
                <div className="flex items-center">
                  <FaWarehouse className="text-xl text-gray-500" />
                  <span className="ml-2">Vehicle Inventory Tracking</span>
                </div>
                <div className="flex items-center">
                  <FaWarehouse className="text-xl text-gray-500" />
                  <span className="ml-2">Charger Stock Management</span>
                </div>
              </div>

              {/* Button */}
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-xl font-semibold">
                Manage Your Plant
              </button>
            </div>
           </Link>

            {/* E-Ashwa Sales Card (with redirection to Coming Soon page) */}
            <Link href="/coming-soon">  {/* Link to the Coming Soon page */}
              <div className="w-full h-[500px] p-10 bg-white rounded-xl shadow-lg border border-gray-300 text-gray-800 flex flex-col items-center justify-center space-y-6 cursor-pointer hover:shadow-2xl">
                <FaUsers className="text-6xl mb-4 text-green-600" />
                <h1 className="text-3xl font-semibold mb-4">E-Ashwa Sales</h1>
                <p className="text-xl mb-6 text-gray-500">Manage your employee data and workforce.</p>

                {/* Checklist for Sales */}
                <div className="space-y-4 mb-6 text-gray-600">
                  <div className="flex items-center">
                    <FaUsers className="text-xl text-gray-500" />
                    <span className="ml-2">Employee Management</span>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="text-xl text-gray-500" />
                    <span className="ml-2">Track Employee Roles</span>
                  </div>
                </div>

                {/* Button */}
                <button className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white text-xl font-semibold">
                  Manage Your Sales
                </button>
              </div>
            </Link>

          </div>

        </div>
      </main>
    </>
  );
}

export default Card;
