import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";

const AdminSignup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [canSignup, setCanSignup] = useState(false);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Check if admin already exists
  useEffect(() => {
    fetch(`${backendUrl}/api/admin/check`)
      .then((res) => res.json())
      .then((data) => setCanSignup(data.canSignup || false))
      .catch(() => setCanSignup(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setSuccess("Admin created successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/admin-login");
      }, 2000);
    } catch (err) {
      setError("Server error, try again later");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!canSignup) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fadeIn">
          <p className="text-red-500 text-lg">
            Admin account already exists. Please login.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Admin Signup
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition"
          >
            Create Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
