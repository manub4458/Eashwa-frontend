"use client";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

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

  const [visits, setVisits] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const storedVisits = localStorage.getItem("visits");
    if (storedVisits) {
      setVisits(JSON.parse(storedVisits));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      const updatedVisits = visits.map((visit) =>
        visit.id === editingId ? { ...visit, ...formData } : visit
      );
      setVisits(updatedVisits);
      localStorage.setItem("visits", JSON.stringify(updatedVisits));
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newVisit = { ...formData, id: Date.now() };
      const updatedVisits = [...visits, newVisit];
      setVisits(updatedVisits);
      localStorage.setItem("visits", JSON.stringify(updatedVisits));
    }

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

  const handleEdit = (id) => {
    const visitToEdit = visits.find((visit) => visit.id === id);
    setFormData(visitToEdit);
    setIsEditing(true);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    const updatedVisits = visits.filter((visit) => visit.id !== id);
    setVisits(updatedVisits);
    localStorage.setItem("visits", JSON.stringify(updatedVisits));
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(visits);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visits");
    XLSX.writeFile(workbook, "visits.xlsx");
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

      {/* Monthly Visit Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-indigo-200">
        <h2 className="text-2xl font-bold text-[#d86331] mb-4">
          Monthly Visit Table
        </h2>
        <button
          onClick={handleDownload}
          className="bg-indigo-600 text-white px-4 py-2 rounded mb-4 hover:bg-indigo-700 transition"
        >
          Download Excel
        </button>
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
                <th className="border border-gray-200 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-100">
                  <td className="border border-gray-200 px-4 py-2">
                    {new Date(visit.dateTime).toLocaleString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {visit.yourName}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {visit.clientName}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {visit.clientPhone}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {visit.clientAddress}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {visit.purpose}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {visit.feedback}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <button
                      onClick={() => handleEdit(visit.id)}
                      className="text-indigo-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(visit.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
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
