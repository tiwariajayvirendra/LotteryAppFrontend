import React, { useEffect, useState } from "react";
import axios from "axios";

const UserModal = ({ onClose }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get("/api/tickets/recent"); // public endpoint
        setTickets(res.data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-11/12 md:w-2/3 p-6 relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Recent Tickets</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : tickets.length === 0 ? (
          <p className="text-center text-gray-500">No tickets purchased yet.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:shadow-md transition-all duration-300"
              >
                <div className="mb-2 md:mb-0 text-gray-700">
                  <p><strong>Name:</strong> {ticket.fullName || "Guest"}</p>
                  <p><strong>Ticket #:</strong> {ticket.ticketNumber}</p>
                  <p><strong>Amount Paid:</strong> ₹{ticket.amountPaid}</p>
                  <p><strong>Purchase Date:</strong> {new Date(ticket.purchaseDate).toLocaleString()}</p>
                </div>

                {ticket.downloadLink && (
                  <a
                    href={ticket.downloadLink}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Ticket
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserModal;
