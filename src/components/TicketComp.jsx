import React, { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

const Ticket = ({ number, amount, userData, onClose }) => {
  const ticketRef = useRef();

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = `Ticket_${number}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    handleDownload();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-40 p-4"
    >
      <div
        ref={ticketRef}
        className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-xl shadow-2xl p-6 w-full max-w-[700px] md:max-w-[600px] flex flex-col justify-between relative font-sans"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-800 hover:text-gray-900 font-bold text-xl md:text-2xl"
        >
          ×
        </button>

        {/* Logo & Header */}
        <div className="flex justify-between items-center mb-4 flex-wrap">
          <div className="bg-white text-yellow-500 px-4 py-2 rounded shadow-md mb-2 md:mb-0">
            <h3 className="font-bold text-lg md:text-xl">Jigoogle Powers</h3>
          </div>
          <div className="bg-indigo-900 text-white px-3 py-1 rounded shadow-md text-sm md:text-base">
            Ticket
          </div>
        </div>

        {/* Lottery Number */}
        <h2 className="text-5xl md:text-6xl font-extrabold text-center text-indigo-800 mb-4 drop-shadow-lg">
          #{number}
        </h2>

        {/* User Info */}
        <div className="text-center text-lg md:text-xl font-semibold mb-4 text-gray-900">
          <p>Name: {userData?.fullName}</p>
          <p>Mobile: {userData?.mobile}</p>
          <p>State: {userData?.state}</p>
          <p>Age: {userData?.age}</p>
          {userData?.aadhaar && <p>Aadhaar: {userData.aadhaar}</p>}
        </div>

        {/* Payment Info */}
        <p className="text-center text-lg md:text-xl font-semibold mb-4 text-indigo-900">
          Amount Paid: ₹{amount}
        </p>

        {/* Rules Section */}
        <div className="text-xs md:text-sm text-gray-800 border-t border-gray-400 pt-3 space-y-1">
          <p>Results will be declared once all tickets are sold.</p>
          <p>For queries, call: 09151341089</p>
          <p>© Jigoogle Powers. All rights reserved.</p>
          <p>By purchasing this ticket, you accept all rules and terms.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Ticket;
