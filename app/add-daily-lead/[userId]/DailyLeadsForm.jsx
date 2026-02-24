"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const DailyLeadsForm = ({ userId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user: userId || "",
    date: new Date().toISOString().split("T")[0],
    numberOfLeads: 0,
    interestedLeads: 0,
    notInterestedFake: 0,
    nextMonthConnect: 0,
    dealerType: "",
    dealerCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  console.log("User ID from URL Params:", userId, formData);

  const onClose = () => {
    router.push(`/employee-detail/${userId}`);
  };

  useEffect(() => {
    if (userId && !formData.user) {
      setFormData((prev) => ({ ...prev, user: userId }));
    }
  }, [userId, formData.user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "date" ? value : name === "dealerType" ? value : Number(value) || 0,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user) newErrors.user = "User ID is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (formData.numberOfLeads < 0)
      newErrors.numberOfLeads = "Number of leads cannot be negative";
    if (formData.dealerType && formData.dealerCount < 0)
      newErrors.dealerCount = "Dealer count cannot be negative";

    console.log("Validation Errors:", newErrors);

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
        "https://backend-eashwa.vercel.app/api/daily-leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        toast.success("Daily leads added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        router.push(`/employee-detail/${userId}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add daily leads");
      }
    } catch (error) {
      toast.error("Error adding daily leads: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-scroll">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Add Daily Leads</h2>
              <p className="text-orange-100 mt-1">
                Record your daily lead metrics
              </p>
            </div>
            <button
              onClick={onClose || (() => router.push("/daily-leads-dashboard"))}
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
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 ${
                  errors.date
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Number of Leads */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Leads <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="numberOfLeads"
                value={formData.numberOfLeads}
                onChange={handleInputChange}
                min="0"
                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 ${
                  errors.numberOfLeads
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="Enter number of leads"
              />
              {errors.numberOfLeads && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.numberOfLeads}
                </p>
              )}
            </div>

            {/* Interested Leads */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Interested Leads
              </label>
              <input
                type="number"
                name="interestedLeads"
                value={formData.interestedLeads}
                onChange={handleInputChange}
                min="0"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 hover:border-gray-300 transition-all duration-200"
                placeholder="Enter interested leads"
              />
            </div>

            {/* Not Interested / Fake */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Not Interested / Fake
              </label>
              <input
                type="number"
                name="notInterestedFake"
                value={formData.notInterestedFake}
                onChange={handleInputChange}
                min="0"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 hover:border-gray-300 transition-all duration-200"
                placeholder="Enter not interested / fake"
              />
            </div>

            {/* Next Month Connect */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Next Month Connect
              </label>
              <input
                type="number"
                name="nextMonthConnect"
                value={formData.nextMonthConnect}
                onChange={handleInputChange}
                min="0"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 hover:border-gray-300 transition-all duration-200"
                placeholder="Enter next month connect"
              />
            </div>

            {/* Dealer Type (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dealer Type (Optional)
              </label>
              <select
                name="dealerType"
                value={formData.dealerType}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 hover:border-gray-300 transition-all duration-200"
              >
                <option value="">Select Lead Type</option>
                <option value="new">This Month Lead</option>
                <option value="old">Old Month Lead</option>
              </select>
            </div>

            {/* Dealer Count (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dealer Count (Optional)
              </label>
              <input
                type="number"
                name="dealerCount"
                value={formData.dealerCount}
                onChange={handleInputChange}
                min="0"
                disabled={!formData.dealerType}
                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 ${
                  errors.dealerCount
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${!formData.dealerType ? "bg-gray-100 cursor-not-allowed" : ""}`}
                placeholder="Enter dealer count"
              />
              {errors.dealerCount && (
                <p className="mt-1 text-sm text-red-600">{errors.dealerCount}</p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose || (() => router.push("/daily-leads-dashboard"))}
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
                "Add Leads"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyLeadsForm;