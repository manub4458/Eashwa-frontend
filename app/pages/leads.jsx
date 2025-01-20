"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const Leads = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [sheetName, setSheetName] = useState("");
  const [savedSheets, setSavedSheets] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null); // File to be uploaded

  // Load saved sheets from localStorage on component mount
  useEffect(() => {
    const storedSheets = JSON.parse(localStorage.getItem("savedSheets")) || [];
    setSavedSheets(storedSheets);
  }, []);

  // Save sheets to localStorage whenever savedSheets changes
  useEffect(() => {
    localStorage.setItem("savedSheets", JSON.stringify(savedSheets));
  }, [savedSheets]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      setSheetName(file.name.split(".")[0]); // Set sheet name as the file name without extension
      setColumns(jsonData[0]); // First row as columns
      setData(jsonData.slice(1)); // Remaining rows as data
    };

    reader.readAsBinaryString(file);
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][colIndex] = value;
    setData(updatedData);
  };

  const handleSaveSheet = () => {
    if (!sheetName) {
      alert("Please upload a sheet first!");
      return;
    }

    const sheetIndex = savedSheets.findIndex((sheet) => sheet.name === sheetName);

    if (sheetIndex !== -1) {
      const updatedSheets = [...savedSheets];
      updatedSheets[sheetIndex] = { name: sheetName, columns, data };
      setSavedSheets(updatedSheets);
      alert(`Sheet "${sheetName}" updated successfully!`);
    } else {
      const newSheet = { name: sheetName, columns, data };
      setSavedSheets((prev) => [...prev, newSheet]);
      alert(`Sheet "${sheetName}" saved successfully!`);
    }

    setSheetName("");
    setColumns([]);
    setData([]);
  };

  const handleDeleteSheet = (index) => {
    const updatedSheets = savedSheets.filter((_, i) => i !== index);
    setSavedSheets(updatedSheets);
  };

  const handleEditSheet = (index) => {
    const sheet = savedSheets[index];
    setSheetName(sheet.name);
    setColumns(sheet.columns);
    setData(sheet.data);
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([columns, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || "Leads");
    XLSX.writeFile(workbook, `${sheetName || "updated_leads"}.xlsx`);
  };

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  const handleUploadFile = async () => {
    if (!fileToUpload) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        alert("Failed to upload the file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Employee Leads Management
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Upload Leads Excel File
          </h2>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="border border-gray-300 rounded-lg w-full p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {data.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Edit Sheet: {sheetName}
              </h2>
              <div className="overflow-auto max-w-full mb-6">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      {columns.map((col, colIndex) => (
                        <th
                          key={colIndex}
                          className="border border-gray-300 p-2 text-left text-gray-600 font-medium"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {columns.map((_, colIndex) => (
                          <td
                            key={colIndex}
                            className="border border-gray-300 p-2"
                          >
                            <input
                              type="text"
                              value={row[colIndex] || ""}
                              onChange={(e) =>
                                handleCellChange(rowIndex, colIndex, e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSaveSheet}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Save Sheet
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Download Updated Excel
                </button>
              </div>
            </>
          )}
        </div>

        {savedSheets.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Saved Sheets
            </h2>
            <ul className="space-y-4">
              {savedSheets.map((sheet, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <span className="font-medium text-gray-700">{sheet.name}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditSheet(index)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSheet(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Upload Edited File to Admin
          </h2>
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg w-full p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleUploadFile}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leads;
