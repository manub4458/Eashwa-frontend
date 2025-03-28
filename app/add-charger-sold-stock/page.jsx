"use client";
import React, { useEffect, useState } from "react";
import AddStock from "../pages/StockAdd";
import axios from "axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const optionLead = [
    "48V",
    "60V",
    "72V",
  ];
  const optionLithium = [
    "48V",
    "60V",
    "72V",
  ];

  const productType =["Lithium-ion Charger", "Lead Acid Charger"];

  const handleLogin = () => {
    if (email === "soldcharger@gmail.com" && password === "sold@123") {
      setIsLoggedIn(true);
      localStorage.setItem("Role2","soldcharger@gmail.com");
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
    const value = localStorage.getItem('Role2')
    if(value){
      setIsLoggedIn(true);
    }else{
      setIsLoggedIn(false);
    }
  },[]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("Role2");

  };
  const handleAddStock = async (data) => {
    const formData = {
      updates: [
        {
          type: "Charger",
          item: data.batteryType,
          quantity: data.quantity,
          updatedBy: data.addedBy,
          specification: data.specification,
          partyName: data.partyName, 
          location: data.location, 
        }
      ],
    };

    try {
      const response = await axios.post(
        // `${process.env.NEXT_PUBLIC_API_URL}/products/add-stock`,
        `${process.env.NEXT_PUBLIC_API_URL}/products/add-sold-stock`,

        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  // Only render AddStock if token is present
  if (!token) return null;

  return (
    // <AddStock
    //   firstItem="Lithium-ion Charger"
    //   secondItem="Lead Acid Charger"
    //   type="Add Charger Sold Stock"
    //   handleAddStock={handleAddStock}
    //   optionLead={optionLead}
    //   optionLithium={optionLithium}
    //   productType={productType}
    // />
    <>
       <div>
      {isLoggedIn ? (
        <div className="relative p-4">
       
          <AddStock
          firstItem="Lithium-ion Charger"
            secondItem="Lead Acid Charger"
            type="Add Charger Sold Stock"
            handleAddStock={handleAddStock}
            optionLead={optionLead}
            optionLithium={optionLithium}
            productType={productType}
          />
          <button
             type="submit"
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
    </>
  );
};

export default Page;
