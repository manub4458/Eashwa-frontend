"use client"
import { useState } from "react";
import axios from "axios";

const LeadsHistory = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post("https://backend-eashwa-dgaw.vercel.app/api/leads/history", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setUploadedFiles([...uploadedFiles, response.data.file]);
            setSelectedFile(null);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };
  return (
 <>
       <div className="p-6 bg-gray-100 min-h-screen">
            {/* Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-orange-600 text-xl font-semibold mb-4">Upload Leads</h2>
                <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="mb-2" />
                <button
                    onClick={handleUpload}
                    className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                >
                    Upload
                </button>
            </div>

            {/* Leads History Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-orange-600 text-xl font-semibold mb-4">Leads History</h2>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Date</th>
                            <th className="border p-2">File Name</th>
                            <th className="border p-2">Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uploadedFiles.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center p-4">No leads uploaded yet.</td>
                            </tr>
                        ) : (
                            uploadedFiles.map((file, index) => (
                                <tr key={index} className="border">
                                    <td className="p-2">{file.date}</td>
                                    <td className="p-2">{file.name}</td>
                                    <td className="p-2">
                                        <a href={file.path} download className="text-blue-600">Download</a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
 </>
  )
}

export default LeadsHistory