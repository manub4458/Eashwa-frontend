"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const TicketForm = () => {
  const [formData, setFormData] = useState({
    dealerName: "",
    dealerPhone: "",
    location: "",
    showroomName: "",
    agentName: "",
    agentPhone: "",
    complaintRegarding: [],
    purchaseDate: "",
    warrantyStatus: "",
    remark: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const complaintOptions = [
    "Battery",
    "Charger",
    "Motor",
    "Controller",
    "Vehicle",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCheckboxChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      complaintRegarding: prev.complaintRegarding.includes(option)
        ? prev.complaintRegarding.filter((item) => item !== option)
        : [...prev.complaintRegarding, option],
    }));
    if (errors.complaintRegarding) {
      setErrors((prev) => ({
        ...prev,
        complaintRegarding: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.dealerName.trim())
      newErrors.dealerName = "Dealer name is required";
    if (!formData.dealerPhone.trim())
      newErrors.dealerPhone = "Dealer phone is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.showroomName.trim())
      newErrors.showroomName = "Showroom name is required";
    if (!formData.agentName.trim())
      newErrors.agentName = "Agent name is required";
    if (!formData.agentPhone.trim())
      newErrors.agentPhone = "Agent phone is required";
    if (!formData.purchaseDate)
      newErrors.purchaseDate = "Purchase date is required";
    if (!formData.warrantyStatus)
      newErrors.warrantyStatus = "Warranty status is required";
    if (formData.complaintRegarding.length === 0)
      newErrors.complaintRegarding =
        "Please select at least one complaint type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://backend-eashwa.vercel.app/api/tickets/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (onSuccess) {
          toast.success("✅ Ticket Raise Successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          router.push("/employees");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit ticket");
      }
    } catch (error) {
      alert("Error submitting ticket: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                Complaint Regarding the Service
              </h2>
              <p className="text-orange-100 mt-1">
                Fill out the form to raise a service ticket
              </p>
            </div>
            <button
              // onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dealer Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dealer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dealerName"
                    value={formData.dealerName}
                    onChange={handleInputChange}
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 ${
                      errors.dealerName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Enter dealer name"
                  />
                  {errors.dealerName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.dealerName}
                    </p>
                  )}
                </div>

                {/* Dealer Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dealer Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="dealerPhone"
                    value={formData.dealerPhone}
                    onChange={handleInputChange}
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 ${
                      errors.dealerPhone
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Enter dealer phone number"
                  />
                  {errors.dealerPhone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.dealerPhone}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 ${
                      errors.location
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Enter location"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Showroom Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Showroom Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="showroomName"
                    value={formData.showroomName}
                    onChange={handleInputChange}
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 ${
                      errors.showroomName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Enter showroom name"
                  />
                  {errors.showroomName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.showroomName}
                    </p>
                  )}
                </div>

                {/* Agent Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Agent Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="agentName"
                    value={formData.agentName}
                    onChange={handleInputChange}
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 ${
                      errors.agentName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Enter agent name"
                  />
                  {errors.agentName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.agentName}
                    </p>
                  )}
                </div>

                {/* Agent Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Agent Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="agentPhone"
                    value={formData.agentPhone}
                    onChange={handleInputChange}
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 ${
                      errors.agentPhone
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Enter agent phone number"
                  />
                  {errors.agentPhone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.agentPhone}
                    </p>
                  )}
                </div>

                {/* Purchase Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Purchase Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 ${
                      errors.purchaseDate
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {errors.purchaseDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.purchaseDate}
                    </p>
                  )}
                </div>

                {/* Warranty Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Warranty Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="warrantyStatus"
                    value={formData.warrantyStatus}
                    onChange={handleInputChange}
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 ${
                      errors.warrantyStatus
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <option value="">Select Warranty Status/Dispatch</option>
                    <option value="In Warranty">In Warranty</option>
                    <option value="Out of Warranty">Out of Warranty</option>
                    <option value="Dispatch Problem">Out of Warranty</option>
                  </select>
                  {errors.warrantyStatus && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.warrantyStatus}
                    </p>
                  )}
                </div>
              </div>

              {/* Complaint Regarding */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Complaint Regarding <span className="text-red-500">*</span>
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Select all that apply)
                  </span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {complaintOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={formData.complaintRegarding.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 transition-all duration-200"
                      />
                      <span className="text-gray-700 group-hover:text-orange-600 transition-colors duration-200 font-medium">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.complaintRegarding && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.complaintRegarding}
                  </p>
                )}
              </div>

              {/* Remark */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Remark
                </label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  placeholder="Tell your problem…"
                  rows={4}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 hover:border-gray-300 transition-all duration-200 resize-none"
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                // onClick={onClose}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Submitting...</span>
                  </span>
                ) : (
                  "Submit Ticket"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;
