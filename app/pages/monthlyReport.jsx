"use client";
import React from "react";

const MonthlyReportPage = () => {
  // Sample Data
  const reportData = {
    totalVisits: 45,
    totalScootySales: 30,
    totalRickshawSales: 15,
    totalERickshawSales: 20,
    topEmployees: [
      { name: "John Smith", sales: 15 },
      { name: "Jane Doe", sales: 12 },
      { name: "Michael Roe", sales: 10 },
    ],
  };

  // Rank employees based on sales
  const rankedEmployees = reportData.topEmployees
    .sort((a, b) => b.sales - a.sales)
    .map((employee, index) => ({
      ...employee,
      rank: index + 1,
    }));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-100 to-orange-50">
      {/* Header */}
      <header className="text-center bg-[#f29871] text-white py-8 shadow-md">
        <h1 className="text-4xl font-bold">Monthly Achievement Report</h1>
        <p className="text-lg italic mt-2">
          Insights into employee performance and sales metrics for this month.
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 mt-10 space-y-8 flex-grow">
        {/* Statistics Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-[#d86331]">Total Visits</h2>
            <p className="text-5xl font-bold text-gray-800 mt-3">
              {reportData.totalVisits}
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-[#d86331]">Scooty Sales</h2>
            <p className="text-5xl font-bold text-gray-800 mt-3">
              {reportData.totalScootySales}
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-[#d86331]">Battery Sales</h2>
            <p className="text-5xl font-bold text-gray-800 mt-3">
              {reportData.totalRickshawSales}
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-[#d86331]">E-Rickshaw Sales</h2>
            <p className="text-5xl font-bold text-gray-800 mt-3">
              {reportData.totalERickshawSales}
            </p>
          </div>
        </section>

        {/* Top Performers Section */}
        <section className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#d86331] mb-6 text-center">
            Top Performers of the Month
          </h2>
          <table className="w-full border-collapse border border-gray-200 text-left">
            <thead>
              <tr className="bg-[#f29871] text-white">
                <th className="p-4 border border-gray-200">Rank</th>
                <th className="p-4 border border-gray-200">Name</th>
                <th className="p-4 border border-gray-200">Sales</th>
              </tr>
            </thead>
            <tbody>
              {rankedEmployees.map((employee) => (
                <tr
                  key={employee.rank}
                  className="hover:bg-gray-100 even:bg-gray-50"
                >
                  <td className="p-4 border border-gray-200 text-center font-semibold">
                    {employee.rank}
                  </td>
                  <td className="p-4 border border-gray-200">{employee.name}</td>
                  <td className="p-4 border border-gray-200 text-center">
                    {employee.sales}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 bg-[#f29871] text-white">
        <p className="text-sm">&copy; 2024 E-ashwa. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MonthlyReportPage;
