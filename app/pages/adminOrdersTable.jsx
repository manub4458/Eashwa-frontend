"use client";
import React, { useState, useEffect } from "react";

const AdminOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [month, setMonth] = useState("");
  const [orderId, setOrderId] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isDispatchHead, setIsDispatchHead] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Fixed row-specific states
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [deliveryOrderId, setDeliveryOrderId] = useState(null);
  const [driverNumber, setDriverNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  // ✅ Drag and drop states
  const [draggedOrder, setDraggedOrder] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // ✅ Fetch orders API
  const fetchOrders = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to view orders");

      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const username = userData.employeeId;
      const authorizedUsers = ["admin@eashwa.in", "EASWS0A30"];

      if (!authorizedUsers.includes(username)) {
        setIsAuthorized(false);
        setError("You are not authorized to view this page.");
        return;
      }

      setIsAuthorized(true);
      setIsAdmin(username === "admin@eashwa.in");
      setIsDispatchHead(username === "EASWS0A30");

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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      // ✅ Fixed priority sorting for admin - consecutive numbers
      let sortedOrders = data.orders;
      if (username === "admin@eashwa.in") {
        // Sort by priority first, then assign consecutive numbers
        sortedOrders = [...data.orders].sort((a, b) => {
          const priorityA = a.priority || 999999;
          const priorityB = b.priority || 999999;
          return priorityA - priorityB;
        });

        // Reassign consecutive priorities to avoid duplicates
        sortedOrders = sortedOrders.map((order, index) => ({
          ...order,
          displayPriority: index + 1 + (currentPage - 1) * limit,
        }));
      }

      setOrders(sortedOrders);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Update status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      if (newStatus === "pending") {
        const response = await fetch(
          `https://backend-eashwa.vercel.app/api/orders/pending/${orderId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to mark as pending");

        // Close dropdown and refresh
        setShowDropdown(null);
        fetchOrders();
      }

      if (newStatus === "deliver") {
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
      alert("Please enter driver and vehicle number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const response = await fetch(
        `https://backend-eashwa.vercel.app/api/orders/deliver/${deliveryOrderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            driverNumber: driverNumber.trim(),
            vehicleNumber: vehicleNumber.trim(),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to confirm delivery");

      // Reset popup state
      setShowDeliveryPopup(false);
      setDeliveryOrderId(null);
      setDriverNumber("");
      setVehicleNumber("");

      fetchOrders();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // ✅ Update priority with consecutive numbering
  const updateOrderPriority = async (orderId, newPriority) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const response = await fetch(
        `https://backend-eashwa.vercel.app/api/orders/priority/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ priority: newPriority }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update priority");
      }

      return data.order;
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    }
  };

  // ✅ Fixed drag and drop with consecutive priority reassignment
  const handleDragStart = (e, order) => {
    if (!isAdmin) return;

    setDraggedOrder(order);
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", order._id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, targetOrder) => {
    if (!isAdmin || !draggedOrder || draggedOrder._id === targetOrder._id)
      return;

    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetOrder) => {
    if (!isAdmin || !draggedOrder || draggedOrder._id === targetOrder._id)
      return;

    e.preventDefault();
    setIsDragging(false);

    try {
      const draggedIndex = orders.findIndex(
        (order) => order._id === draggedOrder._id
      );
      const targetIndex = orders.findIndex(
        (order) => order._id === targetOrder._id
      );

      // Calculate new priorities based on target position
      const targetPriority = targetIndex + 1 + (currentPage - 1) * limit;

      // Update dragged order priority
      await updateOrderPriority(draggedOrder._id, targetPriority);

      // Update all other orders to maintain consecutive numbering
      const updatedOrders = [...orders];
      const [movedOrder] = updatedOrders.splice(draggedIndex, 1);
      updatedOrders.splice(targetIndex, 0, movedOrder);

      // Batch update all priorities to maintain sequence
      for (let i = 0; i < updatedOrders.length; i++) {
        const newPriority = i + 1 + (currentPage - 1) * limit;
        if (updatedOrders[i].priority !== newPriority) {
          await updateOrderPriority(updatedOrders[i]._id, newPriority);
        }
      }

      // Refresh the orders list
      fetchOrders();
    } catch (err) {
      console.error("Error updating priorities:", err);
    }
  };

  // ✅ Close popup
  const closeDeliveryPopup = () => {
    setShowDeliveryPopup(false);
    setDeliveryOrderId(null);
    setDriverNumber("");
    setVehicleNumber("");
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
      case "pending":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white";
      case "pending_verification":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case "ready_for_dispatch":
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      case "completed":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
    }
  };

  const humanizeStatus = (status) =>
    status
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // ✅ Function to display consecutive priority numbers
  const displayPriority = (order, index) => {
    if (isAdmin) {
      return order.displayPriority || index + 1 + (currentPage - 1) * limit;
    }
    return index + 1 + (currentPage - 1) * limit;
  };

  // ✅ Function to determine if dropdown should show for dispatch head
  const shouldShowDropdown = (status) => {
    if (!isDispatchHead) return false;

    // Show dropdown for these statuses
    const editableStatuses = [
      "pending",
      "ready_for_dispatch",
    ];
    return editableStatuses.includes(status);
  };

  const getDropdownOptions = (status) => {
    switch (status) {
      case "pending":
        return [{ label: "Mark as Delivered", value: "deliver" }];

      case "ready_for_dispatch":
        return [
          { label: "Mark as Pending", value: "pending" },
          { label: "Mark as Delivered", value: "deliver" },
        ];
      // case "pending_verification":
      default:
        return [];
    }
  };

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
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-orange-200">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600">
                  <tr>
                    {isAdmin && (
                      <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                        Priority
                      </th>
                    )}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Sr No.
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      PI Number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Party Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Showroom
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Amount Received
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Agent Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Dealer Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Color Variants
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Battery Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      PDF
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-orange-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isAdmin ? 18 : 17}
                        className="px-6 py-8 text-center text-gray-500 bg-orange-50"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="w-16 h-16 text-orange-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            ></path>
                          </svg>
                          <p className="text-xl font-medium text-orange-500">
                            {month
                              ? `No orders found for ${month}`
                              : "No orders found"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr
                        key={order._id || order.id || order.piNumber}
                        draggable={isAdmin}
                        onDragStart={(e) => handleDragStart(e, order)}
                        onDragOver={(e) => handleDragOver(e, order)}
                        onDrop={(e) => handleDrop(e, order)}
                        className={`hover:bg-orange-50 transition-colors duration-200 ${
                          isDragging && draggedOrder?._id === order._id
                            ? "opacity-50 bg-orange-100"
                            : ""
                        }`}
                      >
                        {isAdmin && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 cursor-move drag-handle">
                            {displayPriority(order, index)}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {(currentPage - 1) * limit + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                          {order.piNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.partyName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.showroomName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ₹{order.totalAmount?.toFixed(2) || "0.00"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ₹{order.amountReceived?.toFixed(2) || "0.00"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.agentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.agentPhone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.dealerPhone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.orderModel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.colorVariants}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.batteryType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.deadline
                            ? new Date(order.deadline).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                          {shouldShowDropdown(order.status) ? (
                            <div className="relative">
                              <button
                                onClick={() => {
                                  const uniqueId =
                                    order._id || order.id || order.piNumber;
                                  setShowDropdown(
                                    showDropdown === uniqueId ? null : uniqueId
                                  );
                                }}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusGradient(
                                  order.status
                                )} hover:opacity-90 transition duration-200`}
                              >
                                {humanizeStatus(order.status)} ▼
                              </button>

                              {showDropdown ===
                                (order._id || order.id || order.piNumber) && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-40 flex flex-col">
                                  {getDropdownOptions(order.status).map(
                                    (option, optionIndex) => (
                                      <button
                                        key={option.value}
                                        onClick={() =>
                                          handleStatusChange(
                                            order._id ||
                                              order.id ||
                                              order.piNumber,
                                            option.value
                                          )
                                        }
                                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition duration-200 text-sm ${
                                          optionIndex > 0
                                            ? "border-t border-gray-200"
                                            : ""
                                        } ${
                                          option.value === "pending"
                                            ? "hover:text-red-700"
                                            : "hover:text-green-700"
                                        }`}
                                      >
                                        {option.label}
                                      </button>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusGradient(
                                order.status
                              )}`}
                            >
                              {humanizeStatus(order.status)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.piPdf ? (
                            <a
                              href={order.piPdf}
                              target="_blank"
                              rel="noreferrer"
                              className="text-orange-600 hover:text-orange-800 transition duration-200 font-medium flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                ></path>
                              </svg>
                              View PDF
                            </a>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-orange-50 px-6 py-4 flex items-center justify-between border-t border-orange-200">
              <div className="flex-1 flex justify-between items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="relative inline-flex items-center px-4 py-2 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 disabled:opacity-50 disabled:pointer-events-none transition duration-200"
                >
                  Previous
                </button>
                <div className="hidden md:block">
                  <p className="text-sm text-gray-700">
                    Showing page{" "}
                    <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="relative inline-flex items-center px-4 py-2 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 disabled:opacity-50 disabled:pointer-events-none transition duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          !error && (
            <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
              <svg
                className="w-16 h-16 mx-auto text-red-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              <p className="text-xl font-medium">
                You are not authorized to view this page.
              </p>
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
