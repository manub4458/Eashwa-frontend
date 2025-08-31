'use client'
import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // Assuming JWT is used for token

const AdminOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [month, setMonth] = useState('');
  const [orderId, setOrderId] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to view orders');
      }

      // Decode token to get username (assuming token contains a 'username' field)
      const decodedToken = jwtDecode(token);
      const username = decodedToken.username || decodedToken.email; // Adjust based on your token structure
      const authorizedUsers = ['admin@eashwa.in', 'EASWS0A30'];

      if (!authorizedUsers.includes(username)) {
        setIsAuthorized(false);
        setError('You are not authorized to view this page.');
        return;
      }

      setIsAuthorized(true);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(month && { month }), 
        ...(orderId && { orderId }),
        ...(sortBy && { sortBy }),
      }).toString();
      console.log(`Fetching orders with params: ${queryParams}`);

      const response = await fetch(`http://localhost:5000/api/orders/all-orders?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, month, orderId, sortBy]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusGradient = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending_verification':
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      case 'ready_for_dispatch':
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      case 'completed':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-orange-200">
          <h1 className="text-4xl font-bold text-orange-700 mb-4 text-center">Admin - All Orders Dashboard</h1>
          {error && (
            <p className="text-red-600 mb-4 p-3 bg-red-50 rounded-lg text-center animate-pulse border border-red-200">
              {error}
            </p>
          )}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by Order ID (e.g., PI-12345)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full sm:w-72 rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200 p-2"
              />
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="Filter by Created At Month (YYYY-MM)"
                className="w-full sm:w-56 rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200 p-2"
                required
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-56 rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200 p-2"
              >
                <option value="latest">Latest</option>
                <option value="pending_first">Pending First</option>
                <option value="delivered_first">Delivered First</option>
              </select>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-12 w-12 text-orange-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : isAuthorized ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-orange-200">
                <thead className="bg-gradient-to-r from-orange-100 to-orange-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Sr No.</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">PI Number</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Party Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Showroom</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Total Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Amount Received</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Agent</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Agent Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Dealer Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Model</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Color Variants</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Battery Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Deadline</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={17} className="px-6 py-4 text-center text-gray-500 bg-gray-50">
                        {month ? `No orders found for ${month}` : 'No orders found'}
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr
                        key={order.piNumber}
                        className={`hover:bg-orange-50 transition duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-orange-50'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium sm:px-6 sm:py-4">
                          {(currentPage - 1) * limit + index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.piNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.partyName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.showroomName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.location}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">${order.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">${order.amountReceived.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.agentName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.agentPhone}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.dealerPhone}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.orderModel}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.colorVariants}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.batteryType}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">
                          {new Date(order.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <button
                            className={`px-4 py-1 text-sm font-semibold rounded-full shadow-md cursor-default ${getStatusGradient(
                              order.status || 'Pending'
                            )}`}
                          >
                            {order.status || 'Pending'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                          {order.piPdf ? (
                            <a
                              href={order.piPdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 hover:text-orange-800 underline"
                            >
                              View PDF
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className={`flex items-center gap-2 py-2 px-6 rounded-full bg-white/80 backdrop-blur-md border-2 border-orange-300 text-orange-700 font-semibold shadow-lg hover:bg-orange-100 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 ${currentPage === 1 || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="text-lg text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className={`flex items-center gap-2 py-2 px-6 rounded-full bg-white/80 backdrop-blur-md border-2 border-orange-300 text-orange-700 font-semibold shadow-lg hover:bg-orange-100 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 ${currentPage === totalPages || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : error ? null : (
          <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg shadow-md">
            You are not authorized to view this page.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersTable;