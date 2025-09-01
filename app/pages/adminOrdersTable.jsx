'use client'
import React, { useState, useEffect } from 'react';

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
  const [isDispatchHead, setIsDispatchHead] = useState(false);

  // ✅ Fixed row-specific states
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [deliveryOrderId, setDeliveryOrderId] = useState(null);
  const [driverNumber, setDriverNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  // ✅ Fetch orders API
  const fetchOrders = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to view orders');

      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const username = userData.employeeId;
      const authorizedUsers = ['admin@eashwa.in', 'EASWS0A30'];

      if (!authorizedUsers.includes(username)) {
        setIsAuthorized(false);
        setError('You are not authorized to view this page.');
        return;
      }

      setIsAuthorized(true);
      setIsDispatchHead(username === 'EASWS0A30');

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(month && { month }),
        ...(orderId && { orderId }),
        ...(sortBy && { sortBy }),
      }).toString();

      const response = await fetch(
        `https://backend-eashwa.vercel.app/api/orders/all-orders?${queryParams}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  // ✅ Update status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      if (newStatus === 'pending') {
        const response = await fetch(
          `https://backend-eashwa.vercel.app/api/orders/pending/${orderId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error('Failed to mark as pending');
        
        // Close dropdown and refresh
        setShowDropdown(null);
        fetchOrders();
      }

      if (newStatus === 'deliver') {
        // Open delivery popup
        setDeliveryOrderId(orderId);
        setShowDeliveryPopup(true);
        setShowDropdown(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // ✅ Handle delivery confirmation
  const handleDeliveryConfirm = async () => {
    if (!driverNumber || !vehicleNumber) {
      alert('Please enter driver and vehicle number');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      const response = await fetch(
        `https://backend-eashwa.vercel.app/api/orders/deliver/${deliveryOrderId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            driverNumber: driverNumber.trim(), 
            vehicleNumber: vehicleNumber.trim() 
          }),
        }
      );
      
      if (!response.ok) throw new Error('Failed to confirm delivery');

      // Reset popup state
      setShowDeliveryPopup(false);
      setDeliveryOrderId(null);
      setDriverNumber('');
      setVehicleNumber('');
      
      fetchOrders();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // ✅ Close popup
  const closeDeliveryPopup = () => {
    setShowDeliveryPopup(false);
    setDeliveryOrderId(null);
    setDriverNumber('');
    setVehicleNumber('');
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
      case 'pending':
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      case 'ready_for_dispatch':
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      case 'completed':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    }
  };

  const humanizeStatus = (status) =>
    status
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-orange-200">
          <h1 className="text-4xl font-bold text-orange-700 mb-4 text-center">
            All Orders Dashboard
          </h1>
          {error && (
            <p className="text-red-600 mb-4 p-3 bg-red-50 rounded-lg text-center animate-pulse border border-red-200">
              {error}
            </p>
          )}

          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by Order ID (e.g., PI-12345)"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-72 rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200 p-2"
              />
              <input
                type="month"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-56 rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200 p-2"
              />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-56 rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200 p-2"
              >
                <option value="latest">Latest</option>
                <option value="pending_first">Pending First</option>
                <option value="delivered_first">Delivered First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Delivery Popup */}
        {showDeliveryPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Delivery Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driver Number
                  </label>
                  <input
                    type="text"
                    value={driverNumber}
                    onChange={(e) => setDriverNumber(e.target.value)}
                    placeholder="Enter driver number"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="Enter vehicle number"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleDeliveryConfirm}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Confirm Delivery
                </button>
                <button
                  onClick={closeDeliveryPopup}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loader / Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-12 w-12 text-orange-600"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        ) : isAuthorized ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-orange-200">
                <thead className="bg-gradient-to-r from-orange-100 to-orange-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Sr No.
                    </th>
                    <th className="px-6 py-3">PI Number</th>
                    <th className="px-6 py-3">Party Name</th>
                    <th className="px-6 py-3">Showroom</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">Total Amount</th>
                    <th className="px-6 py-3">Amount Received</th>
                    <th className="px-6 py-3">Agent</th>
                    <th className="px-6 py-3">Agent Phone</th>
                    <th className="px-6 py-3">Dealer Phone</th>
                    <th className="px-6 py-3">Model</th>
                    <th className="px-6 py-3">Color Variants</th>
                    <th className="px-6 py-3">Battery Type</th>
                    <th className="px-6 py-3">Deadline</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={17}
                        className="px-6 py-4 text-center text-gray-500 bg-gray-50"
                      >
                        {month
                          ? `No orders found for ${month}`
                          : 'No orders found'}
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr key={order._id || order.id || order.piNumber}>
                        <td className="px-4 py-3">
                          {(currentPage - 1) * limit + index + 1}
                        </td>
                        <td className="px-4 py-3">{order.piNumber}</td>
                        <td className="px-4 py-3">{order.partyName}</td>
                        <td className="px-4 py-3">{order.showroomName}</td>
                        <td className="px-4 py-3">{order.location}</td>
                        <td className="px-4 py-3">{order.quantity}</td>
                        <td className="px-4 py-3">
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          ₹{order.amountReceived.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">{order.agentName}</td>
                        <td className="px-4 py-3">{order.agentPhone}</td>
                        <td className="px-4 py-3">{order.dealerPhone}</td>
                        <td className="px-4 py-3">{order.orderModel}</td>
                        <td className="px-4 py-3">{order.colorVariants}</td>
                        <td className="px-4 py-3">{order.batteryType}</td>
                        <td className="px-4 py-3">
                          {new Date(order.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 relative">
                          {isDispatchHead &&
                          order.status === 'ready_for_dispatch' ? (
                            <div className="relative">
                              <button
                                onClick={() => {
                                  const uniqueId = order._id || order.id || order.piNumber;
                                  setShowDropdown(
                                    showDropdown === uniqueId ? null : uniqueId
                                  );
                                }}
                                className={`px-3 py-1 rounded ${getStatusGradient(
                                  order.status
                                )} hover:opacity-90 transition duration-200`}
                              >
                                {humanizeStatus(order.status)} ▼
                              </button>
                              
                              {/* ✅ Fixed dropdown - only shows for current order */}
                              {showDropdown === (order._id || order.id || order.piNumber) && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-32">
                                  <button
                                    onClick={() =>
                                      handleStatusChange(order._id || order.id || order.piNumber, 'pending')
                                    }
                                    className="w-full text-left px-3 py-2 hover:bg-red-50 hover:text-red-700 transition duration-200 text-sm"
                                  >
                                    Pending
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(order._id || order.id || order.piNumber, 'deliver')
                                    }
                                    className="w-full text-left px-3 py-2 hover:bg-green-50 hover:text-green-700 transition duration-200 text-sm border-t border-gray-200"
                                  >
                                    Deliver
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              className={`px-3 py-1 rounded ${getStatusGradient(
                                order.status
                              )}`}
                              disabled
                            >
                              {humanizeStatus(order.status)}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {order.piPdf ? (
                            <a
                              href={order.piPdf}
                              target="_blank"
                              rel="noreferrer"
                              className="text-orange-600 underline hover:text-orange-800 transition duration-200"
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

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center px-6 py-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition duration-200"
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition duration-200"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          !error && (
            <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg shadow-md">
              You are not authorized to view this page.
            </div>
          )
        )}

        {/* ✅ Click outside to close dropdown */}
        {showDropdown && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setShowDropdown(null)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersTable;