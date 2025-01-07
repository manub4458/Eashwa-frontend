// components/VisitingForm.js
"use client"
import React, { useState } from 'react';

const VisitingForm = () => {
  const [formData, setFormData] = useState({
    yourName: '',
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    dateTime: '',
    purpose: '',
    feedback: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    alert('Visit logged successfully!');
    setFormData({
      yourName: '',
      clientName: '',
      clientPhone: '',
      clientAddress: '',
      dateTime: '',
      purpose: '',
      feedback: ''
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-indigo-200">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Log a Customer Visit</h2>
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
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
        >
          Submit Visit
        </button>
      </form>
    </div>
  );
};

export default VisitingForm;
