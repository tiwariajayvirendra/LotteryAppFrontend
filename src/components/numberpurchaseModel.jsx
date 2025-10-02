import React, { useState } from "react";

const NumberPurchaseModal = ({ number, amount, skimId, onClose, onPurchase }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    state: "",
    age: "",
    aadhaar: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Sanitize mobile number input to only allow digits
    if (name === "mobile") {
      setFormData({ ...formData, [name]: value.replace(/\D/g, "") });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName) errs.fullName = "Full name is required";
    if (!/^\d{10}$/.test(formData.mobile)) errs.mobile = "Mobile must be 10 digits";
    if (!formData.state) errs.state = "State is required";
    if (!formData.age || !(parseInt(formData.age) > 18)) errs.age = "Age must be over 18";
    if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar)) errs.aadhaar = "Aadhaar must be 12 digits";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Please enter a valid email address";
    return errs;
  };

  const handlePayment = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    if (!razorpayKeyId) {
      setErrors({ general: "Razorpay Key ID is not configured. Please contact support." });
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Create order on backend
      const res = await fetch(`${backendUrl}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          ticketNumber: number,
          skimId: skimId,
          userData: formData,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create order. Status: ${res.status}`);
      }

      const { order } = await res.json();
      if (!order) throw new Error("Order creation failed");

      // 2️⃣ Razorpay options
      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "Lottery Ticket",
        description: `Ticket #${number}`,
        order_id: order.id,
        handler: async (response) => {
          setLoading(true);
          // Verify payment on backend
          const verifyRes = await fetch(`${backendUrl}/api/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              ticketNumber: number,
              skimId: skimId,
              amount,
              userData: formData,
            }),
          });
          const data = await verifyRes.json();
          if (verifyRes.ok) {
            onPurchase(data);
            onClose();
          } else {
            // Display the specific error from the backend
            const serverErrorMessage = data.message || "Payment verification failed on the server.";
            if (verifyRes.status === 409) {
              setErrors({ aadhaar: serverErrorMessage });
            } else {
              setErrors({ general: serverErrorMessage });
            }
          }
          setLoading(false);
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.mobile,
        },
        notes: {
          fullName: formData.fullName,
          mobile: formData.mobile,
          skimId: skimId,
        },
        modal: {
          ondismiss: function () {
            setErrors({ general: "Payment was cancelled." });
            setLoading(false);
          },
        },
        theme: { color: "#FF4444" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      // Do not set loading to false here. It's handled by Razorpay's callbacks.
    } catch (err) {
      console.error("Payment initiation error:", err);
      setErrors({ general: `Payment initiation failed: ${err.message}` });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold">×</button>
        <h2 className="text-2xl font-bold text-center mb-4">Purchase Ticket #{number}</h2>
        <p className="text-lg font-semibold mb-6">Amount: ₹{amount}</p>
        {errors.general && <p className="text-red-500 text-sm text-center mb-4">{errors.general}</p>}

        <form className="w-full flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          {["fullName", "mobile", "state", "age", "aadhaar", "email"].map((field) => (
            <div key={field}>
              <input
                type={field === "age" ? "number" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                maxLength={field === "mobile" ? 10 : field === "aadhaar" ? 12 : undefined}
                value={formData[field]}
                onChange={handleChange}
                className={`border p-2 rounded w-full ${errors[field] ? "border-red-500" : "border-gray-300"}`}
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}

          <button
            type="button"
            onClick={handlePayment}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full"
          >
            {loading ? "Processing..." : "Pay & Get Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NumberPurchaseModal;
