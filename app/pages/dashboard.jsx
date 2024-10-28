"use client";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Link from 'next/link';
import { useState } from 'react';
import Sidebar from "../../components/ui/Dashboard";

// Register the required chart components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'BatteryModel1',
        data: [200, 250, 300, 280, 320],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'BatteryModel2',
        data: [150, 120, 180, 160, 200],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Charger',
        data: [100, 90, 130, 110, 140],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <>
  
      <div className="flex flex-col min-h-screen bg-gray-100">

     
        <header className="w-full  p-4 py-6 px-10  flex justify-between items-center shadow-lg">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
           
          </div>

          {/* Search Bar */}
          <div className="bg-white text-black p-2 rounded shadow-sm flex items-center ">
         
          <Link href='/login'>
          <button className="text-white bg-green-600 px-3 py-1 rounded">Login</button>
          </Link>
          </div>
        </header>

        <div className="flex flex-col md:flex-row flex-1">
          {/* Sidebar */}
          {/* <aside className="w-full md:w-64 bg-[#d86331] text-white p-4">
            <div className="font-bold text-xl mb-6">Your Dashboard</div>
            <nav>
              <ul className="space-y-4">
                <li className="hover:bg-green-700 p-2 rounded">Overview</li>
                <Link href='/form'>
                  <li className="hover:bg-green-700 p-2 rounded">Form</li> 
                </Link>
             <Link href='/battery'>
             <li className="hover:bg-green-700 p-2 rounded">Battery Stock</li>
             </Link>
         <Link href='/charger'>
         <li className="hover:bg-green-700 p-2 rounded">Charger Stock</li>
         </Link>
                <li className="hover:bg-green-700 p-2 rounded">Transactions</li>
              </ul>
            </nav>
          </aside> */}
          {/* <Dashboard/> */}
          <Sidebar/>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <h1 className="text-2xl font-bold">Battery Stock Overview</h1>
            </header>

            {/* Stock Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Lead Acid Battery Stock</h2>
                <p className="text-3xl font-bold text-green-600">200</p>
                <p className="text-sm text-gray-500">Available</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Lithium Ion Battery Stock</h2>
                <p className="text-3xl font-bold text-green-600">150</p>
                <p className="text-sm text-gray-500">Available</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Charger Stock</h2>
                <p className="text-3xl font-bold text-green-600">75</p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Charger Stock</h2>
                <p className="text-3xl font-bold text-green-600">75</p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
            </section>

            {/* Monthly Stock Information */}
            <section className="mt-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Monthly Stock Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xl font-bold">Total Batteries Sold</p>
                    <p className="text-2xl font-semibold text-green-600">500</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">Total Chargers Sold</p>
                    <p className="text-2xl font-semibold text-green-600">120</p>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
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
