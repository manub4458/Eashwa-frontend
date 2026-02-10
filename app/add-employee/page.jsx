"use client";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  CreditCard,
  Briefcase,
  Calendar,
  Upload,
  UserPlus,
  Loader2,
  Image,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function RegisterUserForm() {
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    aadhaarNumber: "",
    role: "employee",
    employeeId: "",
    phone: "",
    joiningDate: "",
    post: "",
    profilePicture: "",
    managedBy: "",
  });
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState({});

  const managers = [
    { id: "6792a56b6b4c7a0c3d52890e", name: "Abhinav Badola" },
    { id: "67aa444eb198d893d8ba1f8a", name: "Deepak Lochan Agarwal" },
    { id: "67f827a58a535582d4e879cc", name: "Nitin Sharma" },
    // { id: "67fa3ea0d3f06c7ecf03cba5", name: "Ramesh Kumar Pandey" },
   // { id: "6937c43f607a13e3b3d00c26", name: "Ayush" },
    { id: "6936a0b0e449db2f15d5ebff", name: "Amit Malik" },
     { id: "6981cec91543ae2c5fe004f1", name: "Pooja Sharma" },
      { id: "69809997c086012c831a3d39", name: "Abhishek Taneja" },
  ];

  const roles = [
    { value: "employee", label: "Employee" },
    { value: "hr", label: "HR" },
    { value: "manager", label: "Manager" },
    { value: "admin-plant", label: "Admin Plant" },
    { value: "admin", label: "Admin" },
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("images", file);

      const response = await fetch(
        "https://backend-eashwa.vercel.app/api/images/upload-images",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error("Image upload failed");
        throw new Error("Image upload failed");
      }

      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        profilePicture: data.images[0] || "",
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = "Aadhaar must be 12 digits";
    }
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.joiningDate)
      newErrors.joiningDate = "Joining date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        phone: formData.phone ? Number(formData.phone) : null,
        aadhaarNumber: formData.aadhaarNumber
          ? Number(formData.aadhaarNumber)
          : null,
        managedBy: formData.managedBy || null,
      };

      const response = await fetch(
        "https://backend-eashwa.vercel.app/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      toast.success("User registered successfully!");

      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        aadhaarNumber: "",
        role: "employee",
        employeeId: "",
        phone: "",
        joiningDate: "",
        post: "",
        profilePicture: "",
        managedBy: "",
      });
      setPreviewImage("");
      setErrors({});
      router.push("/hr-dash");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.message || "Failed to register user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Register New User</h1>
            </div>
            <p className="text-orange-100 text-lg">
              Fill in the details to create a new user account
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center space-y-4 pb-6 border-b border-gray-200">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-orange-100 overflow-hidden bg-gray-100 flex items-center justify-center shadow-lg">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  {imageUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <label className="cursor-pointer">
                  <div className="px-6 py-2 bg-orange-50 text-orange-600 font-medium rounded-lg hover:bg-orange-100 transition-all flex items-center gap-2 shadow-sm">
                    <Upload className="h-4 w-4" />
                    Upload Profile Picture
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={imageUploading}
                  />
                </label>
                <p className="text-sm text-gray-500">
                  Max size: 5MB (JPG, PNG)
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-600" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none ${
                      errors.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      ⚠️ {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-orange-600" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none ${
                      errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      ⚠️ {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-orange-600" />
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none ${
                      errors.password
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      ⚠️ {errors.password}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-orange-600" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10 digit number"
                    maxLength="10"
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none ${
                      errors.phone
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      ⚠️ {errors.phone}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none hover:border-gray-300"
                  />
                </div>

                {/* Aadhaar Number */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-orange-600" />
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    placeholder="12 digit Aadhaar"
                    maxLength="12"
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none ${
                      errors.aadhaarNumber
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {errors.aadhaarNumber && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      ⚠️ {errors.aadhaarNumber}
                    </p>
                  )}
                </div>

                {/* Employee ID */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-orange-600" />
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="EMP001"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none hover:border-gray-300"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-600" />
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none ${
                      errors.role
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      ⚠️ {errors.role}
                    </p>
                  )}
                </div>

                {/* Post */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-orange-600" />
                    Post/Designation
                  </label>
                  <input
                    type="text"
                    name="post"
                    value={formData.post}
                    onChange={handleChange}
                    placeholder="Team Lead, Manager, etc."
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none hover:border-gray-300"
                  />
                </div>

                {/* Joining Date */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none ${
                      errors.joiningDate
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {errors.joiningDate && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      ⚠️ {errors.joiningDate}
                    </p>
                  )}
                </div>

                {/* Managed By */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-600" />
                    Managed By
                  </label>
                  <select
                    name="managedBy"
                    value={formData.managedBy}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none hover:border-gray-300"
                  >
                    <option value="">Select Manager (Optional)</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading || imageUploading}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-lg rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      Register User
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
