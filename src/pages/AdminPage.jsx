import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TicketRow = ({ ticket }) => (


  <tr key={ticket._id} className="text-center hover:bg-gray-50 transition-colors">
    <td className="py-3 px-4 border-b">{ticket.fullName}</td>
    <td className="py-3 px-4 border-b">{ticket.mobile}</td>
    <td className="py-3 px-4 border-b">{ticket.age}</td>
    <td className="py-3 px-4 border-b">{ticket.state}</td>
    <td className="py-3 px-4 border-b">{ticket.aadhaar || "N/A"}</td>
    <td className="py-3 px-4 border-b font-bold">{ticket.ticketNumber}</td>
    <td className="py-3 px-4 border-b">{ticket.skimId || "N/A"}</td>
    <td className="py-3 px-4 border-b">₹{ticket.amountPaid}</td>
    <td className="py-3 px-4 border-b">
      {ticket.razorpayOrderId || "N/A"}
    </td>
    <td className="py-3 px-4 border-b">
      {ticket.razorpayPaymentId || "N/A"}
    </td>
    <td className="py-3 px-4 border-b text-xs text-gray-600" title={ticket.razorpaySignature}>
      {ticket.razorpaySignature ? `${ticket.razorpaySignature.substring(0, 15)}...` : "N/A"}
    </td>
    <td className="py-3 px-4 border-b">
      {new Date(ticket.purchaseDate).toLocaleString()}
    </td>
    <td className="py-3 px-4 border-b">
      <a
        href={ticket.downloadLink || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={`px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors duration-300 ${!ticket.downloadLink ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-disabled={!ticket.downloadLink}
        onClick={(e) => !ticket.downloadLink && e.preventDefault()}
      >
        Download
      </a>
    </td>
  </tr>
);







const AdminPage = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ticketsPerPage = 10; // You can adjust this number

  const [exporting, setExporting] = useState(false);
  const [totalTickets, setTotalTickets] = useState(0);





  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Not logged in as admin");
      navigate("/admin-login");
      return;
    }

    const fetchTickets = async () => {
      setLoading(true);
      try {
        // Fetch tickets with pagination parameters
        const res = await fetch(`${backendUrl}/api/admin/tickets?page=${currentPage}&limit=${ticketsPerPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            // Token is invalid or expired
            handleLogout();
            return;
          }
          setError(data.message || "Failed to fetch tickets");
          return;
        }
       
        // Assuming the backend returns totalPages and tickets
        setTickets(data.data || []);
        setTotalPages(data.totalPages);
        setTotalTickets(data.totalTickets);



      } catch (err) {
        console.error(err);
        setError("Server error, could not fetch tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [navigate, backendUrl, currentPage]);

  // Admin logout handler
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    navigate("/admin-login");
  };

  const handleExport = async () => {
    setExporting(true);
    setError("");
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(`${backendUrl}/api/admin/tickets/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to export tickets.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error("Export error:", err);
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const visiblePageNumbers = () => {
    const maxVisiblePages = 5; // Adjust as needed
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    // Implement logic to show a subset of pages with ellipsis
    // This is a simplified version
    return Array.from({ length: Math.min(maxVisiblePages, totalPages) }, (_, i) => i + 1);
  };
  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel - Purchased Tickets</h1>
          {totalTickets > 0 && <p className="text-sm text-gray-600 mt-1">Total Tickets: {totalTickets}</p>}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExport}
            disabled={exporting || totalTickets === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {exporting ? "Exporting..." : "Export to CSV"}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-600 uppercase text-sm">
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Mobile</th>
              <th className="py-3 px-4 border-b">Age</th>
              <th className="py-3 px-4 border-b">State</th>
              <th className="py-3 px-4 border-b">Aadhaar</th>
              <th className="py-3 px-4 border-b">Ticket #</th>
              <th className="py-3 px-4 border-b">Skim ID</th>
              <th className="py-3 px-4 border-b">Amount Paid</th>
              <th className="py-3 px-4 border-b">Purchase Date</th>
              <th className="py-3 px-4 border-b">Order ID</th>
              <th className="py-3 px-4 border-b">Payment ID</th>
              <th className="py-3 px-4 border-b">Signature</th>
              <th className="py-3 px-4 border-b">Download</th>
            </tr>

          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="13" className="text-center py-4">
                  <div className="flex justify-center items-center">
                     Loading tickets...
                  </div>
                </td>
              </tr>
            ) : tickets.length > 0 ? (
              tickets.map((ticket) => <TicketRow key={ticket._id} ticket={ticket} />)
            ) : (
              <tr>
                <td colSpan="13" className="text-center py-4">
                  No tickets purchased yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
        <div className="flex justify-center mt-4">
          {/* Pagination Buttons */}
          

           {currentPage > 1 && (
            <button onClick={() => handlePageChange(currentPage - 1)} className="px-4 py-2 mx-1 bg-gray-200 hover:bg-gray-300 rounded">Previous</button>
          )}

          {visiblePageNumbers().map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 mx-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {page}
            </button>
          ))}
          {currentPage < totalPages && (
            <button onClick={() => handlePageChange(currentPage + 1)} className="px-4 py-2 mx-1 bg-gray-200 hover:bg-gray-300 rounded">Next</button>
          )}
        </div>
    </div>
  );
};

export default AdminPage;
