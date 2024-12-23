"use client";
import React from "react";

const MonthlyReportPage = () => {
  // Sample Data
  const reportData = {
    totalVisits: 45,
    totalScootySales: 30,
    totalRickshawSales: 15,
    topEmployees: [
      { name: "John Smith", sales: 15 },
      { name: "Jane Doe", sales: 12 },
      { name: "Michael Roe", sales: 10 },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
      <header className="text-center bg-indigo-600 text-white py-6">
        <h1 className="text-3xl font-bold">Monthly Report</h1>
        <p className="text-lg italic mt-2">
          Gain insights into employee performance for this month.
        </p>
      </header>

      <main className="container mx-auto px-4 mt-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-indigo-600">Total Visits</h2>
            <p className="text-4xl font-bold text-gray-800 mt-2">{reportData.totalVisits}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-indigo-600">Scooty Sales</h2>
            <p className="text-4xl font-bold text-gray-800 mt-2">{reportData.totalScootySales}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-indigo-600">Battery Sales</h2>
            <p className="text-4xl font-bold text-gray-800 mt-2">{reportData.totalRickshawSales}</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-4">Top Performers</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-indigo-500 text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Sales</th>
              </tr>
            </thead>
            <tbody>
              {reportData.topEmployees.map((employee, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{employee.name}</td>
                  <td className="p-3">{employee.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default MonthlyReportPage;
