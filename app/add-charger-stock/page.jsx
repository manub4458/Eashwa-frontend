"use client";
import React, { useEffect, useState } from "react";
import AddStock from "../pages/StockAdd";
import axios from "axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const [token, setToken] = useState(null);
  const router = useRouter();

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
          item: "Lithium-ion Charger",
          quantity: data.stock1,
          updatedBy: data.addedBy,
        },
        {
          type: "Charger",
          item: "Lead Acid Charger",
          quantity: data.stock2,
          updatedBy: data.addedBy,
        },
      ],
    };

    try {
      const response = await axios.post(
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

  if (!token) return null; // Only render the component if token is present

  return (
    <AddStock
      firstItem="Lithium-ion Charger"
      secondItem="Lead Acid Charger"
      type="Add Charger Stock"
      handleAddStock={handleAddStock}
    />
  );
};

export default Page;
