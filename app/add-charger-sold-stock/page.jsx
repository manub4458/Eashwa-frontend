"use client";
import React, { useEffect, useState } from "react";
import AddStock from "../pages/StockAdd";
import axios from "axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const [token, setToken] = useState(null);
  const router = useRouter();
  const optionLead = [
    "3 Amp",
    "4 Amp",
    "5 Amp",
  ];
  const optionLithium = [
    "4 Amp",
    "5 Amp",
    "6 Amp",
  ];

  const productType =["Lithium-ion Charger", "Lead Acid Charger"];

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
          type: "Charger",
          item: data.batteryType,
          quantity: data.quantity,
          updatedBy: data.addedBy,
          specification: data.specification,
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
    <AddStock
      firstItem="Lithium-ion Charger"
      secondItem="Lead Acid Charger"
      type="Add Charger Sold Stock"
      handleAddStock={handleAddStock}
      optionLead={optionLead}
      optionLithium={optionLithium}
      productType={productType}
    />
  );
};

export default Page;
