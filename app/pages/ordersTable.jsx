'use client'
import React, { useState, useEffect } from 'react';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [month, setMonth] = useState('');
  const [orderId, setOrderId] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to view orders');
      }

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(month && { month }), // Filter by createdAt month (YYYY-MM)
        ...(orderId && { orderId }),
        ...(sortBy && { sortBy }),
      }).toString();
      console.log(`Fetching orders with params: ${queryParams}`); // Debug log

      const response = await fetch(`https://backend-eashwa.vercel.app/api/orders/my-orders?${queryParams}`, {
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

  return (
    <div className="min-h-screen bg-orange-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-600">My Orders</h1>
        {error && (
          <p className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg text-center animate-pulse">
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
              className="w-full sm:w-64 rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200 p-2"
            />
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="Select Month (YYYY-MM) by Created At"
              className="w-full sm:w-48 rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200 p-2"
              required
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-48 rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200 p-2"
            >
              <option value="latest">Latest</option>
              <option value="pending_first">Pending First</option>
              <option value="delivered_first">Delivered First</option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <svg className="animate-spin h-8 w-8 text-orange-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
              <table className="min-w-full divide-y divide-orange-200">
                <thead className="bg-orange-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sr No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">PI Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Party Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Showroom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount Received</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Agent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Agent Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Dealer Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Model</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Color Variants</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Battery Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Deadline</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={17} className="px-4 py-4 text-center text-gray-500">
                        {month ? `No orders found for ${month}` : 'No orders found'}
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr key={order.piNumber} className="hover:bg-orange-50 transition duration-200">
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {(currentPage - 1) * limit + index + 1}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{order.piNumber}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{order.partyName}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{order.showroomName}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{order.location}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{order.quantity}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">${order.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">${order.amountReceived.toFixed(2)}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{order.agentName}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{order.agentPhone}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{order.dealerPhone}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{order.orderModel}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{order.colorVariants}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{order.batteryType}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {new Date(order.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{order.status || 'Pending'}</td>
                        <td className="px-4 py-4 text-sm">
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
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className={`py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 ${currentPage === 1 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className={`py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 ${currentPage === totalPages || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;