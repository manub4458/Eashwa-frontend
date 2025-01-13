"use client";
import React, { useState, useEffect } from "react";

const VisitingForm = () => {
  const [formData, setFormData] = useState({
    yourName: "",
    clientName: "",
    clientPhone: "",
    clientAddress: "",
    dateTime: "",
    purpose: "",
    feedback: "",
  });

  const [visits, setVisits] = useState([]); // State to store all visits

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchVisits(token);
    }
  }, []);

  const fetchVisits = async (token) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://backend-eashwa.vercel.app/api/visits", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVisits(data.visits || []);
      } else {
        console.error("Failed to fetch visits");
      }
    } catch (error) {
      console.error("Error fetching visits:", error);
    }
  };

  const saveVisit = async (newVisit) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to save visits.");
      return;
    }

    try {
      const response = await fetch("https://backend-eashwa.vercel.app/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newVisit),
      });

      if (response.ok) {
        const savedVisit = await response.json();
        setVisits((prev) => [...prev, savedVisit]);
        alert("Visit logged successfully!");
      } else {
        console.error("Failed to save visit");
      }
    } catch (error) {
      console.error("Error saving visit:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newVisit = { ...formData, id: Date.now() };
    saveVisit(newVisit);

    setFormData({
      yourName: "",
      clientName: "",
      clientPhone: "",
      clientAddress: "",
      dateTime: "",
      purpose: "",
      feedback: "",
    });
  };

  return (
    <div className="container mx-auto p-4">
         <div className="bg-white shadow-lg rounded-lg p-6 border border-indigo-200 mb-8">
        <h2 className="text-2xl font-bold text-[#d86331] mb-4">Log a Customer Visit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="yourName">
              Your Name
            </label>
            <input
              type="text"
              id="yourName"
              name="yourName"
              value={formData.yourName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Shiv"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="clientName">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter Client name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="clientPhone">
              Client Phone No
            </label>
            <input
              type="tel"
              id="clientPhone"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter Client phone number"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="clientAddress">
              Client Address
            </label>
            <input
              type="text"
              id="clientAddress"
              name="clientAddress"
              value={formData.clientAddress}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter Client address"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="dateTime">
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="purpose">
              Purpose
            </label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Ex. Dealer, Distributor"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="feedback">
              Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Ex. What client says..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#d86331] text-white py-2 px-4 rounded hover:bg-[#d8693a] transition duration-200"
          >
            Submit Visit
          </button>
        </form>
      </div>
      {/* Visiting Form */}
      

      {/* Monthly Visit Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-indigo-200">
        <h2 className="text-2xl font-bold text-[#d86331] mb-4">Monthly Visit Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-indigo-100">
                <th className="border border-gray-200 px-4 py-2">Date</th>
                <th className="border border-gray-200 px-4 py-2">Your Name</th>
                <th className="border border-gray-200 px-4 py-2">Client Name</th>
                <th className="border border-gray-200 px-4 py-2">Phone</th>
                <th className="border border-gray-200 px-4 py-2">Address</th>
                <th className="border border-gray-200 px-4 py-2">Purpose</th>
                <th className="border border-gray-200 px-4 py-2">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-100">
                  <td className="border border-gray-200 px-4 py-2">
                    {new Date(visit.dateTime).toLocaleString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">{visit.yourName}</td>
                  <td className="border border-gray-200 px-4 py-2">{visit.clientName}</td>
                  <td className="border border-gray-200 px-4 py-2">{visit.clientPhone}</td>
                  <td className="border border-gray-200 px-4 py-2">{visit.clientAddress}</td>
                  <td className="border border-gray-200 px-4 py-2">{visit.purpose}</td>
                  <td className="border border-gray-200 px-4 py-2">{visit.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitingForm;
