'use client'
import React, { useState } from 'react'

const DetailForm = () => {
  const initialFormData = {
    piNumber: '',
    partyName: '',
    showroomName: '',
    location: '',
    quantity: '',
    totalAmount: '',
    agentName: '',
    amountReceived: '',
    orderModel: '',
    colorVariants: '',
    batteryType: '',
    deadline: '',
    agentPhone: '',
    dealerPhone: '',
    piPdf: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setFile(null);
      setFormData({ ...formData, piPdf: '' });
      return;
    }

    setFile(selectedFile);
    setError('');
    setIsUploading(true);

    try {
      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedFile);

        const uploadResponse = await fetch('http://localhost:5000/api/images/upload-pdf', {
          method: 'POST',
          body: formDataUpload,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadData.success) {
          throw new Error(uploadData.message || 'PDF upload failed');
        }

        setFormData({ ...formData, piPdf: uploadData.fileUrl });
        setSuccess('PDF uploaded successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload PDF');
      setFormData({ ...formData, piPdf: '' });
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (!token) {
        throw new Error('Please log in to submit the order');
      }

      const response = await fetch('http://localhost:5000/api/orders/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add Bearer token to headers
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Form submission failed');
      }

      setSuccess('Order submitted successfully!');
      setFormData(initialFormData);
      setFile(null);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-3xl transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-600">Order Submission</h1>
        {error && (
          <p className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg text-center animate-pulse">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 mb-4 p-3 bg-green-50 rounded-lg text-center animate-pulse">
            {success}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="piNumber" className="block text-sm font-medium text-gray-700">PI Number</label>
              <input
                type="text"
                id="piNumber"
                name="piNumber"
                value={formData.piNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="partyName" className="block text-sm font-medium text-gray-700">Party Name</label>
              <input
                type="text"
                id="partyName"
                name="partyName"
                value={formData.partyName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="showroomName" className="block text-sm font-medium text-gray-700">Showroom Name</label>
              <input
                type="text"
                id="showroomName"
                name="showroomName"
                value={formData.showroomName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
                min="1"
              />
            </div>
            <div>
              <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">Total Amount</label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="agentName" className="block text-sm font-medium text-gray-700">Agent Name</label>
              <input
                type="text"
                id="agentName"
                name="agentName"
                value={formData.agentName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="amountReceived" className="block text-sm font-medium text-gray-700">Amount Received</label>
              <input
                type="number"
                id="amountReceived"
                name="amountReceived"
                value={formData.amountReceived}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="orderModel" className="block text-sm font-medium text-gray-700">Order Model</label>
              <input
                type="text"
                id="orderModel"
                name="orderModel"
                value={formData.orderModel}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="colorVariants" className="block text-sm font-medium text-gray-700">Color Variants</label>
              <input
                type="text"
                id="colorVariants"
                name="colorVariants"
                value={formData.colorVariants}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="batteryType" className="block text-sm font-medium text-gray-700">Battery Type</label>
              <input
                type="text"
                id="batteryType"
                name="batteryType"
                value={formData.batteryType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="datetime-local"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="agentPhone" className="block text-sm font-medium text-gray-700">Agent Phone</label>
              <input
                type="tel"
                id="agentPhone"
                name="agentPhone"
                value={formData.agentPhone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="dealerPhone" className="block text-sm font-medium text-gray-700">Dealer Phone</label>
              <input
                type="tel"
                id="dealerPhone"
                name="dealerPhone"
                value={formData.dealerPhone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="piPdf" className="block text-sm font-medium text-gray-700">Upload PI PDF (Max 10MB)</label>
              <input
                type="file"
                id="piPdf"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 transition duration-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {isUploading && (
                <p className="text-orange-600 mt-2 flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Uploading PDF...
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className={`w-full py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200 font-semibold ${isLoading || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Order'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DetailForm;