"use client"
import React, { useEffect, useState } from "react";
// import AddStock from "../pages/StockAdd";
import VehicleAdd from '../pages/vehicleAdd'
import axios from "axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const [token, setToken] = useState(null);
  const router = useRouter();

  const optionVehicle = [
    "Dangus pro",
    "Dangus plus",
    "Glide",
    "Glide plus",
    "Nebo",
    "Rakkit 100",
    "Velox",
    "Velox pro",
    "Velox plus",
  ];

  const productType = ["Vehicle"];

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/404-page-not-found");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleAddStock = async (data) => {
    const formData = {
      updates: [
        {
          type: "Vehicle",
          item: data.vehicleType,
          quantity: data.quantity,
          updatedBy: data.addedBy,
          specification: data.specification, // Ensure this is from `optionVehicle` if type is Vehicle
        },
      ],
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products/add-stock`,
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

  if (!token) return null;

  return (
    <VehicleAdd
      firstItem="Vehicle"
      type="Add Vehicle  Stock"
      handleAddStock={handleAddStock}
      options={optionVehicle}
      productType = {productType} // Update here to ensure only Vehicle options are shown
  
    />
  );
};

export default Page;
