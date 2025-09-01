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

  // ✅ Row-specific states
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [driverInputs, setDriverInputs] = useState({});
  const [vehicleInputs, setVehicleInputs] = useState({});

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
        fetchOrders();
      }

      if (newStatus === 'deliver') {
        const driverNumber = driverInputs[orderId] || '';
        const vehicleNumber = vehicleInputs[orderId] || '';

        if (!driverNumber || !vehicleNumber) {
          alert('Please enter driver and vehicle number');
          return;
        }

        const response = await fetch(
          `https://backend-eashwa.vercel.app/api/orders/deliver/${orderId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ driverNumber, vehicleNumber }),
          }
        );
        if (!response.ok) throw new Error('Failed to confirm delivery');

        // reset only for that row
        setSelectedOrderId(null);
        setDriverInputs((prev) => ({ ...prev, [orderId]: '' }));
        setVehicleInputs((prev) => ({ ...prev, [orderId]: '' }));

        fetchOrders();
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
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
            Admin - All Orders Dashboard
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
                      <tr key={order.piNumber}>
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
                        <td className="px-4 py-3">
                          {isDispatchHead &&
                          order.status === 'ready_for_dispatch' ? (
                            <div>
                              {selectedOrderId === order.id ? (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={driverInputs[order.id] || ''}
                                    onChange={(e) =>
                                      setDriverInputs((prev) => ({
                                        ...prev,
                                        [order.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="Driver Number"
                                    className="border rounded p-1"
                                  />
                                  <input
                                    type="text"
                                    value={vehicleInputs[order.id] || ''}
                                    onChange={(e) =>
                                      setVehicleInputs((prev) => ({
                                        ...prev,
                                        [order.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="Vehicle Number"
                                    className="border rounded p-1"
                                  />
                                  <button
                                    onClick={() =>
                                      handleStatusChange(order.id, 'deliver')
                                    }
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                  >
                                    Confirm Delivery
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(order.id, 'pending')
                                    }
                                    className="bg-red-500 text-white px-3 py-1 rounded ml-2"
                                  >
                                    Mark Pending
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setSelectedOrderId(order.id)}
                                  className={`px-3 py-1 rounded ${getStatusGradient(
                                    order.status
                                  )}`}
                                >
                                  {humanizeStatus(order.status)}
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              className={`px-3 py-1 rounded ${getStatusGradient(
                                order.status
                              )}`}
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
                              className="text-orange-600 underline"
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
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 bg-orange-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="px-4 py-2 bg-orange-200 rounded disabled:opacity-50"
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
      </div>
    </div>
  );
};

export default AdminOrdersTable;
