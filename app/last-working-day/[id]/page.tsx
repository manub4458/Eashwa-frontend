"use client";

import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

const LastWorkingDateForm: React.FC = () => {
  const [lastWorkingDate, setLastWorkingDate] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({
        type: "error",
        text: "Please log in to update the last working date.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        "https://backend-eashwa.vercel.app/api/user/update-last-working-date",
        { userId: id, lastWorkingDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage({
          type: "success",
          text: "Last working date updated successfully!",
        });
        setLastWorkingDate("");
        setTimeout(() => router.push(`/employee-detail/${id}`), 2000);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating the last working date.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#d86331] to-[#e07a4a] rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m4-6v6M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Update Last Working Date
          </h2>
          <p className="text-gray-600">
            Set the final working date for the employee
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Input */}
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                htmlFor="lastWorkingDate"
              >
                Last Working Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="lastWorkingDate"
                  value={lastWorkingDate}
                  onChange={(e) => setLastWorkingDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#d86331] focus:ring-4 focus:ring-[#d86331]/20 transition-all duration-200 shadow-sm hover:border-gray-300"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m4-6v6m-4-4h8m-8-4h8"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  message.type === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {message.type === "success" ? (
                      <svg
                        className="h-5 w-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{message.text}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`relative w-full py-3 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200 shadow-lg ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed transform scale-95"
                  : "bg-gradient-to-r from-[#d86331] to-[#e07a4a] hover:from-[#c55a2e] hover:to-[#d86331] hover:shadow-xl transform hover:scale-105 active:scale-95"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Updating...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Update Last Working Date
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              This action will set the employee's final working date
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastWorkingDateForm;
