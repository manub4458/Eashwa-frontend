"use client";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const VisitingForm = () => {
  const [formData, setFormData] = useState({
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
  const [authToken, setAuthToken] = useState("");

  // Fetch visitors when component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setAuthToken(storedToken);
      fetchVisitors(storedToken);
    }
  }, []);

  // Fetch visitors API call
  const fetchVisitors = async (token) => {
    try {
      const response = await axios.get(
        "https://backend-eashwa.vercel.app/api/user/get-visitor",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Get-visitor",response);
      if (response.status === 200) {
        setVisits(response.data);
        localStorage.setItem("visits", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
      alert("Failed to fetch visitors.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authToken) {
      alert("Please log in to submit the form.");
      return;
    }

    try {
      const newVisit = {
        clientName: formData.clientName,
        clientPhoneNumber: formData.clientPhone,
        clientAddress: formData.clientAddress,
        visitDateTime: formData.dateTime,
        purpose: formData.purpose,
        feedback: formData.feedback
      };

      if (isEditing) {
        // Update logic would need to be implemented with backend API
        alert("Editing not yet implemented with backend");
        return;
      } else {
        // API call to add a visitor
        const response = await axios.post(
          "https://backend-eashwa.vercel.app/api/user/add-visitor",
          newVisit,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 201 || response.status === 200) {
          // Refetch visitors to get updated list from backend
          fetchVisitors(authToken);
          alert("Visit logged successfully!");
        } else {
          throw new Error("Failed to log visit.");
        }
      }

      // Reset form
      setFormData({
        clientName: "",
        clientPhone: "",
        clientAddress: "",
        dateTime: "",
        purpose: "",
        feedback: "",
      });
      
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error logging visit:", error);
      alert("An error occurred while logging the visit.");
    }
  };

  console.log("visit",visits);
  const handleEdit = (id) => {
    const visitToEdit = visits.find((visit) => visit.id === id);
    if (visitToEdit) {
      setFormData({
        clientName: visitToEdit.clientName,
        clientPhone: visitToEdit.clientPhoneNumber,
        clientAddress: visitToEdit.clientAddress,
        dateTime: visitToEdit.visitDateTime,
        purpose: visitToEdit.purpose,
        feedback: visitToEdit.feedback
      });
      setIsEditing(true);
      setEditingId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://backend-eashwa.vercel.app/api/user/delete-visitor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Refetch visitors to get updated list from backend
        fetchVisitors(authToken);
        alert("Visit deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting visit:", error);
      alert("An error occurred while deleting the visit.");
    }
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
        <h2 className="text-2xl font-bold text-[#d86331] mb-4">
          {isEditing ? "Edit Visit" : "Log a Customer Visit"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {isEditing ? "Update Visit" : "Submit Visit"}
          </button>
        </form>
      </div>

      {/* Monthly Visit Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-indigo-200">
        <h2 className="text-2xl font-bold text-[#d86331] mb-4">Monthly Visit Table</h2>
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
                <th className="border border-gray-200 px-4 py-2">Client Name</th>
                <th className="border border-gray-200 px-4 py-2">Phone</th>
                <th className="border border-gray-200 px-4 py-2">Address</th>
                <th className="border border-gray-200 px-4 py-2">Purpose</th>
                <th className="border border-gray-200 px-4 py-2">Feedback</th>
                <th className="border border-gray-200 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visits.map??((visit) => (
                <tr key={visit.id} className="text-center">
                  <td className="border border-gray-200 px-4 py-2">{visitorDeatils?.visitDateTime}</td>
                  <td className="border border-gray-200 px-4 py-2">{visit.clientName}</td>
                  <td className="border border-gray-200 px-4 py-2">{visit.clientPhoneNumber}</td>
                  <td className="border border-gray-200 px-4 py-2">{visit.clientAddress}</td>
                  <td className="border border-gray-200 px-4 py-2">{visit.purpose}</td>
                  <td className="border border-gray-200 px-4 py-2">{visit.feedback}</td>
                  <td className="border border-gray-200 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(visit.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(visit.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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