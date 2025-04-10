// HistoryTable.js
import { useState } from "react";

const HistoryTable = ({
  title,
  data,
  filterMonth,
  setFilterMonth,
  formatDateTime,
  showDelete = false,
  handleDeleteFile,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 8;

  // Pagination calculations
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = data.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(data.length / entriesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-semibold text-[#d86331] mb-4">{title}</h2>
      <div className="flex gap-4 mb-4">
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Download</th>
            {showDelete && <th className="border p-2">Delete</th>}
          </tr>
        </thead>
        <tbody>
          {currentEntries.length > 0 ? (
            currentEntries.map((lead, index) => (
              <tr key={index}>
                <td className="border p-2 text-center">
                  {formatDateTime(lead.uploadDate)}
                </td>
                <td className="border p-2 text-center">
                  <a
                    href={lead.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Download
                  </a>
                </td>
                {showDelete && (
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDeleteFile(lead._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={showDelete ? 3 : 2}
                className="border p-2 text-center"
              >
                No leads found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {data.length > entriesPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default HistoryTable;
