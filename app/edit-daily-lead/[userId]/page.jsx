// components/DailyLeadsForm.tsx

"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const DailyLeadsForm = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const leadId = params.userId;
  const userId = searchParams.get("userId"); 

  const onClose = () => {
    router.push(`/admin-daily-leads/${userId}`);
  };

  const router = useRouter();
  const [formData, setFormData] = useState({
    user: userId || "",
    date: new Date().toISOString().split("T")[0],
    numberOfLeads: 0,
    interestedLeads: 0,
    notInterestedFake: 0,
    nextMonthConnect: 0,
    totalDealer: 0,
  });
  const [loading, setLoading] = useState(!!leadId); // Load if editing
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (leadId) {
      fetchLeadData();
    }
  }, [leadId]);

  const fetchLeadData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://backend-eashwa.vercel.app/api/daily-leads/${leadId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch lead data");

      const lead = await response.json();
      setFormData({
        user: lead.user,
        date: new Date(lead.date).toISOString().split("T")[0],
        numberOfLeads: lead.numberOfLeads,
        interestedLeads: lead.interestedLeads,
        notInterestedFake: lead.notInterestedFake,
        nextMonthConnect: lead.nextMonthConnect,
        totalDealer: lead.totalDealer,
      });
    } catch (error) {
      toast.error(error.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "date" ? value : Number(value) || 0,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "Date is required";
    if (formData.numberOfLeads < 0)
      newErrors.numberOfLeads = "Cannot be negative";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const method = leadId ? "PUT" : "POST";
      const url = leadId
        ? `https://backend-eashwa.vercel.app/api/daily-leads/${leadId}`
        : "https://backend-eashwa.vercel.app/api/daily-leads";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success(leadId ? "Updated successfully" : "Added successfully");
      router.push(`/admin-daily-leads/${userId}`);
    } catch (error) {
      toast.error(error.message || "Error saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-scroll">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {leadId ? "Edit" : "Add"} Daily Leads
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-opacity-20 rounded-full p-2"
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
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full p-4 border-2 rounded-xl ${errors.date ? "border-red-300" : "border-gray-200"}`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>
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

            {/* Total Dealer (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total Dealers (Optional)
              </label>
              <input
                type="number"
                name="totalDealer"
                value={formData.totalDealer}
                onChange={handleInputChange}
                min="0"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 hover:border-gray-300 transition-all duration-200"
                placeholder="Enter total dealers"
              />
            </div>
            {/* ... other inputs similar ... */}
          </form>
        </div>
        <div className="border-t p-6 bg-gray-50 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl disabled:opacity-50"
          >
            {loading ? "Saving..." : leadId ? "Update" : "Add"} Leads
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyLeadsForm;
