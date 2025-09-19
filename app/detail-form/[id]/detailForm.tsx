"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface OrderData {
  _id: string;
  piNumber: string;
  partyName: string;
  showroomName: string;
  location: string;
  quantity: string;
  totalAmount: string;
  agentName: string;
  amountReceived: string;
  orderModel: string;
  colorVariants: string;
  batteryType: string;
  deadline: string;
  agentPhone: string;
  dealerPhone: string;
  piPdf: string;
  status?: string;
  remark?: string;
  pendingReason?: string;
  priority?: string;
}

const DetailForm = ({ orderId }: { orderId?: string }) => {
  const params = useParams();
  const router = useRouter();
  const id = orderId || (params.id as string);

  const initialFormData: OrderData = {
    _id: "",
    piNumber: "",
    partyName: "",
    showroomName: "",
    location: "",
    quantity: "",
    totalAmount: "",
    agentName: "",
    amountReceived: "",
    orderModel: "",
    colorVariants: "",
    batteryType: "",
    deadline: "",
    agentPhone: "",
    dealerPhone: "",
    piPdf: "",
    status: "",
    remark: "",
    pendingReason: "",
    priority: "",
  };

  const [formData, setFormData] = useState<OrderData>(initialFormData);
  const [file, setFile] = useState<File | null>(null);
  const [originalPdfUrl, setOriginalPdfUrl] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch order data if in edit mode
  useEffect(() => {
    if (id) {
      fetchOrderData();
      setIsEditMode(true);
    }
  }, [id]);

  const fetchOrderData = async () => {
    if (!id) return;

    setIsFetching(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to access this order");
      }

      const response = await fetch(
        `https://backend-eashwa.vercel.app/api/orders/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch order data");
      }

      const responseData = await response.json();
      if (responseData.success) {
        setFormData(responseData.order);
        setOriginalPdfUrl(responseData.order.piPdf || "");
        setSuccess("Order data loaded successfully!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load order data");
      console.error("Error fetching order:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error on input change
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      setFile(null);
      setFormData({ ...formData, piPdf: originalPdfUrl });
      return;
    }

    setFile(selectedFile);
    setError("");
    setIsUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", selectedFile);

      const uploadResponse = await fetch(
        "https://backend-eashwa.vercel.app/api/images/upload-pdf",
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.message || "PDF upload failed");
      }

      setFormData({ ...formData, piPdf: uploadData.fileUrl });
      setSuccess("PDF uploaded successfully!");
      setOriginalPdfUrl(uploadData.fileUrl); // Update original URL
    } catch (err: any) {
      setError(err.message || "Failed to upload PDF");
      setFormData({ ...formData, piPdf: originalPdfUrl });
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to submit the order");
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        totalAmount: parseFloat(formData.totalAmount) || 0,
        amountReceived: parseFloat(formData.amountReceived) || 0,
        priority: formData.priority ? parseInt(formData.priority) : undefined,
      };

      let response;
      let endpoint = isEditMode
        ? `https://backend-eashwa.vercel.app/api/orders/${id}`
        : "https://backend-eashwa.vercel.app/api/orders/submit";

      if (isEditMode) {
        // Update existing order
        response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submitData),
        });
      } else {
        // Create new order
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submitData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Form submission failed");
      }

      const responseData = await response.json();

      if (isEditMode) {
        setSuccess("Order updated successfully!");
        router.push('/admin-table');
      } else {
        setSuccess("Order submitted successfully!");
        setFormData(initialFormData);
        setFile(null);
        setOriginalPdfUrl("");
      }

      // Redirect after successful submission (optional)
      if (!isEditMode) {
        setTimeout(() => {
          router.push("/orders"); // Adjust route as needed
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setFile(null);
    setOriginalPdfUrl("");
    setError("");
    setSuccess("");
    router.back(); // Go back to previous page
  };

  // Show loading state while fetching data
  if (isFetching && isEditMode) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-3xl transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-orange-600">
            {isEditMode ? "Edit Order" : "Order Submission"}
          </h1>
          {isEditMode && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>

        {error && (
          <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg text-center animate-pulse">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-500 mb-4 p-3 bg-green-50 rounded-lg text-center animate-pulse">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label
                htmlFor="piNumber"
                className="block text-sm font-medium text-gray-700"
              >
                PI Number{" "}
                {isEditMode && (
                  <span className="text-gray-400">(Read-only)</span>
                )}
              </label>
              <input
                type="text"
                id="piNumber"
                name="piNumber"
                value={formData.piNumber}
                onChange={handleInputChange}
                disabled={isEditMode}
                className={`mt-1 block w-full rounded-lg border shadow-sm transition duration-200 ${
                  isEditMode
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                    : "border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                }`}
                required={!isEditMode}
              />
            </div>

            <div>
              <label
                htmlFor="partyName"
                className="block text-sm font-medium text-gray-700"
              >
                Party Name
              </label>
              <input
                type="text"
                id="partyName"
                name="partyName"
                value={formData.partyName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="showroomName"
                className="block text-sm font-medium text-gray-700"
              >
                Showroom Name
              </label>
              <input
                type="text"
                id="showroomName"
                name="showroomName"
                value={formData.showroomName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
                min="1"
              />
            </div>

            <div>
              <label
                htmlFor="totalAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Total Amount
              </label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
                step="0.01"
              />
            </div>

            <div>
              <label
                htmlFor="agentName"
                className="block text-sm font-medium text-gray-700"
              >
                Agent Name
              </label>
              <input
                type="text"
                id="agentName"
                name="agentName"
                value={formData.agentName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="amountReceived"
                className="block text-sm font-medium text-gray-700"
              >
                Amount Received
              </label>
              <input
                type="number"
                id="amountReceived"
                name="amountReceived"
                value={formData.amountReceived}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
                step="0.01"
              />
            </div>

            <div>
              <label
                htmlFor="orderModel"
                className="block text-sm font-medium text-gray-700"
              >
                Order Model
              </label>
              <input
                type="text"
                id="orderModel"
                name="orderModel"
                value={formData.orderModel}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="colorVariants"
                className="block text-sm font-medium text-gray-700"
              >
                Color Variants
              </label>
              <input
                type="text"
                id="colorVariants"
                name="colorVariants"
                value={formData.colorVariants}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="batteryType"
                className="block text-sm font-medium text-gray-700"
              >
                Battery Type
              </label>
              <input
                type="text"
                id="batteryType"
                name="batteryType"
                value={formData.batteryType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="deadline"
                className="block text-sm font-medium text-gray-700"
              >
                Deadline
              </label>
              <input
                type="datetime-local"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="agentPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Agent Phone
              </label>
              <input
                type="tel"
                id="agentPhone"
                name="agentPhone"
                value={formData.agentPhone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="dealerPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Dealer Phone
              </label>
              <input
                type="tel"
                id="dealerPhone"
                name="dealerPhone"
                value={formData.dealerPhone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                required
              />
            </div>

            {/* Additional fields for edit mode */}
            {isEditMode && (
              <>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                  >
                    <option value="">Select Status</option>
                    <option value="pending_verification">
                      Pending Verification
                    </option>
                    <option value="payment_received">Payment Received</option>
                    <option value="payment_not_received">
                      Payment Not Received
                    </option>
                    <option value="ready_for_dispatch">
                      Ready for Dispatch
                    </option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="remark"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Remark
                  </label>
                  <textarea
                    id="remark"
                    name="remark"
                    value={formData.remark || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                    placeholder="Add any remarks or notes..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Priority (1-10)
                  </label>
                  <input
                    type="number"
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="mt-1 block w-full rounded-lg border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                  />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label
                htmlFor="piPdf"
                className="block text-sm font-medium text-gray-700"
              >
                PI PDF{" "}
                {originalPdfUrl && !file && (
                  <span className="text-green-600">(Current file loaded)</span>
                )}
              </label>

              {originalPdfUrl && !file && isEditMode && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <a
                    href={originalPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    View Current PDF
                  </a>
                </div>
              )}

              <input
                type="file"
                id="piPdf"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 transition duration-200 ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />

              {isUploading && (
                <p className="text-orange-600 mt-2 flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Uploading PDF...
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading || isUploading || isFetching}
              className={`flex-1 py-3 px-4 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 font-semibold ${
                isLoading || isUploading || isFetching
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isEditMode ? "Cancel" : "Reset"}
            </button>
            <button
              type="submit"
              disabled={isLoading || isUploading || isFetching}
              className={`flex-1 py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200 font-semibold ${
                isLoading || isUploading || isFetching
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  {isEditMode ? "Updating..." : "Submitting..."}
                </span>
              ) : isEditMode ? (
                "Update Order"
              ) : (
                "Submit Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailForm;
