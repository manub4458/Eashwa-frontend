"use client";
import React, { useEffect, useState } from "react";

const MonthlyReportPage = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopEmployees = async () => {
      try {
        const response = await fetch(
          "https://backend-eashwa.vercel.app/api/user/top-employees"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        const data = await response.json();
        const formattedData = {
          message: data.message,
          topEmployees: data.topEmployees.map((employee) => ({
            name: employee.name,
            email: employee.email,
            percentage: parseFloat(employee.percentage),
            sales: {
              battery: employee.targetAchieved.battery.completed,
              eRickshaw: employee.targetAchieved.eRickshaw.completed,
              scooty: employee.targetAchieved.scooty.completed,
            },
          })),
        };
        setReportData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopEmployees();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const rankedEmployees = reportData.topEmployees
    .sort((a, b) => b.percentage - a.percentage)
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
          {reportData.message || "Insights into employee performance"}
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 mt-10 space-y-8 flex-grow">
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
                <th className="p-4 border border-gray-200">Achievement (%)</th>
                <th className="p-4 border border-gray-200">Battery Sales</th>
                <th className="p-4 border border-gray-200">E-Rickshaw Sales</th>
                <th className="p-4 border border-gray-200">Scooty Sales</th>
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
                    {employee.percentage}%
                  </td>
                  <td className="p-4 border border-gray-200 text-center">
                    {employee.sales.battery}
                  </td>
                  <td className="p-4 border border-gray-200 text-center">
                    {employee.sales.eRickshaw}
                  </td>
                  <td className="p-4 border border-gray-200 text-center">
                    {employee.sales.scooty}
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
