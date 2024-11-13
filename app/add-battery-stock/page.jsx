"use client";
import React, { useEffect, useState } from "react";
import AddStock from "../pages/StockAdd";
import axios from "axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const [token, setToken] = useState(null);
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
  ]

  const productType =["Lithium-ion Battery", "Lead Acid Battery"];


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
          type: "Battery",
          item: data.batteryType,
          quantity: data.quantity,
          updatedBy: data.addedBy,
          specification: data.specification,
          partyName: data.partyName, // Adding partyName
          location: data.location,   // Adding location
        }
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
    <AddStock
      firstItem="Lithium-ion Battery"
      secondItem="Lead Acid Battery"
      type="Battery"
      handleAddStock={handleAddStock}
      optionLead = {optionLead}
      optionLithium = {optionLithium}
      productType={productType}
    />
  );
};

export default Page;
