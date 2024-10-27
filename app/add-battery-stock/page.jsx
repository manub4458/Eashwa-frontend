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
          type: "Battery",
          item: "Lithium-ion Battery",
          quantity: data.stock1,
          updatedBy: data.addedBy,
        },
        {
          type: "Battery",
          item: "Lead Acid Battery",
          quantity: data.stock2,
          updatedBy: data.addedBy,
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

  // Only render AddStock if token is present
  if (!token) return null;

  return (
    <AddStock
      firstItem="Lithium-ion Battery"
      secondItem="Lead Acid Battery"
      type="Add Battery Stock"
      handleAddStock={handleAddStock}
    />
  );
};

export default Page;
