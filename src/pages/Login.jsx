// import React, { useState, useContext, useEffect } from "react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const backendUrl = "http://localhost:5000"; // your backend URL

//   // Show success message if redirected from signup
//   useEffect(() => {
//     if (location.state?.message) {
//       setSuccess(location.state.message);
//     }
//   }, [location.state]);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { email, password } = form;

//     if (!email || !password) {
//       setError("Both email and password are required");
//       return;
//     }

//     setError("");
//     setSuccess("");

//     try {
//       const res = await fetch(`${backendUrl}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Login failed");
//         return;
//       }

//       // ✅ Save user to localStorage for persistence
//       localStorage.setItem("user", JSON.stringify(data.user));

//       // ✅ Call context login to update state
//       login(data.user);

//       // ✅ Navigate to dashboard
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Server error, please try again");
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
//       <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

//         {success && (
//           <p className="text-green-500 text-sm text-center mb-4">{success}</p>
//         )}
//         {error && (
//           <p className="text-red-500 text-sm text-center mb-4">{error}</p>
//         )}

//         <form onSubmit={handleLogin} className="space-y-4">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <button
//             type="submit"
//             className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           >
//             Login
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm text-gray-600">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-indigo-600 font-semibold">
//             Signup
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;