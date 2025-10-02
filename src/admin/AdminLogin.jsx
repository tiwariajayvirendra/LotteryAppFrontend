import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Make sure this matches your backend port
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${backendUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Check if network response is okay
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || `Login failed with status: ${res.status}`);
        return;
      }

      const data = await res.json();

      // Store admin JWT in localStorage
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUsername", data.username);

      // Redirect to admin panel
      navigate("/admin");
    } catch (err) {
      console.error("Network error:", err);
      if (err instanceof TypeError) { // Often indicates a network error
        setError("Server not reachable. Please check your connection and ensure the backend is running.");
      } else {
        setError("An unexpected error occurred during login.");
      }
    }
  };

  return (
    <AuthLayout title="Admin Login">
      {error && (
        <p className="text-red-500 mb-4 text-center animate-shake">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition"
        >
          Login
        </button>
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;
