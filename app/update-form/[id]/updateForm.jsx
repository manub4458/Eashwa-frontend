"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

const UpdateTargetForm = () => {
  const params = useParams(); // Get ID from URL params
  const id = params.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token"); // Fetch token from localStorage
      const response = await axios.put(
        `https://backend-eashwa.vercel.app/api/user/update-target/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token for authorization
          },
        }
      );

      toast.success("Target updated successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log("Update Response:", response);
      reset(); // Reset form after submission
    } catch (error) {
      console.error("Error updating target:", error);
      toast.error(
        error.response?.data?.message || "Failed to update target. Try again!",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Update Target
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Battery Target */}
          <div>
            <label
              htmlFor="battery"
              className="block text-sm font-medium text-gray-700"
            >
              Battery Target
            </label>
            <input
              id="battery"
              type="number"
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.battery ? "border-red-500" : "border-gray-300"
              }`}
              {...register("battery", {
                required: "Battery target is required",
                min: { value: 0, message: "Value cannot be negative" },
              })}
            />
            {errors.battery && (
              <p className="text-red-500 text-sm mt-1">
                {errors.battery.message}
              </p>
            )}
          </div>

          {/* E-Rickshaw Target */}
          <div>
            <label
              htmlFor="eRickshaw"
              className="block text-sm font-medium text-gray-700"
            >
              E-Rickshaw Target
            </label>
            <input
              id="eRickshaw"
              type="number"
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.eRickshaw ? "border-red-500" : "border-gray-300"
              }`}
              {...register("eRickshaw", {
                required: "E-Rickshaw target is required",
                min: { value: 0, message: "Value cannot be negative" },
              })}
            />
            {errors.eRickshaw && (
              <p className="text-red-500 text-sm mt-1">
                {errors.eRickshaw.message}
              </p>
            )}
          </div>

          {/* Scooty Target */}
          <div>
            <label
              htmlFor="scooty"
              className="block text-sm font-medium text-gray-700"
            >
              Scooty Target
            </label>
            <input
              id="scooty"
              type="number"
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.scooty ? "border-red-500" : "border-gray-300"
              }`}
              {...register("scooty", {
                required: "Scooty target is required",
                min: { value: 0, message: "Value cannot be negative" },
              })}
            />
            {errors.scooty && (
              <p className="text-red-500 text-sm mt-1">
                {errors.scooty.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTargetForm;
