"use client";
import React, { useEffect, useState } from "react";
import AddStock from "../pages/StockAdd"; // Ensure this is the correct path for AddStock
import axios from "axios";
import { useRouter } from "next/navigation";
import Button from '../../components/ui/button'

const Page = () => {
  const [token, setToken] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const optionLead = [
    "12V 28AH",
    "12V 30AH",
    "12V 32AH",
  ];
  const optionLithium = [
    "60V 24AH",
    "60V 28AH",
    "60V 30AH",
    "60V 32AH",
    "60V 34AH",
    "60V 36AH",
    "60V 38AH",
    "60V 40AH",
    "60V 42AH",
  ];

  const productType = ["Lithium-ion Battery", "Lead Acid Battery"];

  // Handle login
  const handleLogin = () => {
    if (email === "soldbattery@gmail.com" && password === "sold@123") {
      setIsLoggedIn(true);
      localStorage.setItem("Role","soldbattery@gmail.com");
      setLoginError("");
    } else {
      setLoginError("Invalid credentials, please try again!");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/404-page-not-found");
    } else {
      setToken(storedToken);
    }
  }, [router]);
  useEffect(()=>{
    const value = localStorage.getItem('Role')
    if(value){
      setIsLoggedIn(true);
    }else{
      setIsLoggedIn(false);
    }
  },[])
  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("Role");
  };

  // API request to add stock
  const handleAddStock = async (data) => {
    const formData = {
      updates: [
        {
          type: "Battery",
          item: data.batteryType,
          quantity: data.quantity,
          updatedBy: data.addedBy,
          specification: data.specification,
          partyName: data.partyName, // Adding partyName
          location: data.location, // Adding location
        },
      ],
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products/add-sold-stock`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token dynamically
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error adding stock:", error);
      throw error;
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div className="relative p-4">
       
          <AddStock
            firstItem="Lithium-ion Battery"
            secondItem="Lead Acid Battery"
            type="Add Battery Sold Stock"
            handleAddStock={handleAddStock}
            optionLead={optionLead}
            optionLithium={optionLithium}
            productType={productType}
          />
             <button
            
             onClick={handleLogout}
             >
              Logout
             </button>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100">
          <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center text-gray-700">Login</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              {loginError && (
                <p className="text-sm text-red-500">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full py-2 mb-20 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
