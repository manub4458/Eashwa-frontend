// components/VisitingForm.js
"use client"
import React, { useState } from 'react';

const VisitingForm = () => {
  const [formData, setFormData] = useState({
    asmName: '',
    clientName: '',
    location: '',
    time: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    alert('Visit logged successfully!');
    setFormData({ asmName: '', clientName: '', location: '', time: '', notes: '' });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-indigo-200">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Log a Customer Visit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="asmName">
            ASM Name
          </label>
          <input
            type="text"
            id="asmName"
            name="asmName"
            value={formData.asmName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            placeholder="Enter ASM name"
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
          <label className="block text-gray-700 font-medium mb-1" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            placeholder="Enter location"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="time">
            Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="notes">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            placeholder="Enter additional notes"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
        >
          Submit Visit
        </button>
      </form>
    </div>
  );
};

export default VisitingForm;
