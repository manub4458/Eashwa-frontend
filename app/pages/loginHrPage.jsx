"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

const LoginHrPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error message
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error message
    try {
      const response = await axios.post(
        "https://backend-eashwa.vercel.app/api/user/login",
        { email, password }
      );
      console.log("Response-user",response);
      if (response.data.ok) {
        Cookies.set("authToken", response.data.authToken, { expires: 1 });
        localStorage.setItem("token", response.data.authToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        if (response.data.user.role === "employee") {
          router.push("/employees");
        } else if (response.data.user.role === "hr") {
          router.push("/hr-dash");
        } else {
          router.push("/404");
        }
      }
    } catch (err) {
      // Set error message if login fails
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login failed:", errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-[#d86331] mb-6">
          Login
        </h1>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#d86331] text-white py-2 px-4 rounded-md shadow hover:bg-[#df7f55] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginHrPage;
