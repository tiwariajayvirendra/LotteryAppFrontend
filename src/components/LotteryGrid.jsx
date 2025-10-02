import React, { useState, useEffect } from "react";
import NumberPurchaseModal from "../components/numberpurchaseModel.jsx";
import { useNavigate, useParams, Link } from "react-router-dom";

const LotteryPage = () => {
  const navigate = useNavigate();
  const { powerNumber: skimId } = useParams(); // Use skimId for clarity

  const TOTAL_NUMBERS = 1000;
  const START_NUMBER = 5001;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [purchasedNumbers, setPurchasedNumbers] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedNumber, setSelectedNumber] = useState(null);

  // Fetch purchased tickets from backend
  useEffect(() => {
    const fetchPurchased = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const res = await fetch(`${backendUrl}/api/tickets/purchased-tickets/${skimId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setPurchasedNumbers(new Set(data.purchasedTickets));
      } catch (err) {
        console.error("Error fetching purchased tickets", err);
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };
    fetchPurchased();
  }, [skimId, backendUrl]);

  // Generate ticket numbers array
  const numbers = Array.from({ length: TOTAL_NUMBERS }, (_, i) => START_NUMBER + i);

  const handleNumberClick = (num) => {
    if (!purchasedNumbers.has(num)) setSelectedNumber(num);
  };

  const handleSuccessfulPurchase = (data) => {
    // Ensure ticketNumber is treated as a number for the Set
    const purchasedTicketNumber = Number(data.userData.tickets[data.userData.tickets.length - 1].ticketNumber);
    setPurchasedNumbers((prev) => new Set(prev).add(purchasedTicketNumber));
    setSelectedNumber(null); // Close the modal
    navigate('/success', { state: { downloadLink: data.downloadLink, userData: data.userData, ticket: data.userData.tickets[data.userData.tickets.length - 1] } });
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          🎯 Select Your Favorite Number - Skim {skimId}
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Number Grid */}
      <div className="relative min-h-[70vh] p-2 rounded shadow-lg bg-white">
        {loading ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-80 z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-lg text-gray-600">Loading Tickets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 overflow-auto max-h-[calc(70vh-1rem)] scrollbar-hide">
            {numbers.map((num) => (
              <div
                key={num}
                onClick={() => handleNumberClick(num)}
                aria-label={`Ticket number ${num}`}
                className={`flex items-center justify-center aspect-square font-semibold rounded-lg cursor-pointer shadow-md transition-all duration-300
                  ${
                    purchasedNumbers.has(num)
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
                      : "bg-gradient-to-br from-green-400 to-blue-600 text-white hover:scale-110 transform"
                  }`}
              >
                {num}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {selectedNumber && (
        <NumberPurchaseModal
          number={selectedNumber}
          amount={100}
          skimId={skimId}
          onClose={() => setSelectedNumber(null)}
          onPurchase={handleSuccessfulPurchase}
        />
      )}
    </div>
  );
};

export default LotteryPage;
