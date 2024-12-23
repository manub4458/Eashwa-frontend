"use client";
import React, { useState } from "react";

const HistoryPage = () => {
  const [filterMonth, setFilterMonth] = useState("");

  // Sample Data
  const visits = [
    {
      id: 1,
      asmName: "John Smith",
      clientName: "TechCorp Inc.",
      location: "New York",
      date: "2024-11-05",
      time: "11:00 AM",
    },
    {
      id: 2,
      asmName: "Jane Doe",
      clientName: "Greenfield Industries",
      location: "San Francisco",
      date: "2024-11-03",
      time: "02:15 PM",
    },
    {
      id: 3,
      asmName: "Michael Roe",
      clientName: "Blue Horizon Logistics",
      location: "Chicago",
      date: "2024-10-29",
      time: "10:30 AM",
    },
    {
      id: 4,
      asmName: "Emily Davis",
      clientName: "Redstone Pvt Ltd",
      location: "Boston",
      date: "2024-10-28",
      time: "01:45 PM",
    },
  ];

  const filteredVisits = visits.filter((visit) =>
    filterMonth ? visit.date.startsWith(filterMonth) : true
  );

  const handleDownload = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ASM Name,Client Name,Location,Date,Time"]
        .concat(
          filteredVisits.map(
            (v) => `${v.asmName},${v.clientName},${v.location},${v.date},${v.time}`
          )
        )
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "visit_history.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
      <header className="text-center bg-indigo-600 text-white py-6">
        <h1 className="text-3xl font-bold">History</h1>
        <p className="text-lg italic mt-2">Review your past visits and filter them easily!</p>
      </header>

      <main className="container mx-auto px-4 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <label htmlFor="filterMonth" className="block text-gray-700 font-semibold">
              Filter by Month:
            </label>
            <input
              type="month"
              id="filterMonth"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="mt-1 p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleDownload}
            className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
          >
            Download as CSV
          </button>
        </div>

        <table className="w-full table-auto bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="p-3 text-left">ASM Name</th>
              <th className="p-3 text-left">Client Name</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits.map((visit) => (
              <tr key={visit.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{visit.asmName}</td>
                <td className="p-3">{visit.clientName}</td>
                <td className="p-3">{visit.location}</td>
                <td className="p-3">{visit.date}</td>
                <td className="p-3">{visit.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default HistoryPage;
