// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// const Signup = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const backendUrl = "http://localhost:5000"; // backend URL

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     const { name, email, password } = form;

//     if (!name || !email || !password) {
//       setError("All fields are required");
//       return;
//     }

//     setError("");
//     setSuccess("");

//     try {
//       const res = await fetch(`${backendUrl}/api/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Signup failed");
//         return;
//       }

//       // ✅ Show success message before redirect
//       setSuccess("Signup successful! Redirecting to login...");
//       setTimeout(() => {
//         navigate("/", { state: { message: "Signup successful! Please login." } });
//       }, 1500);
//     } catch (err) {
//       console.error(err);
//       setError("Server error, try again");
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
//       <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-6">Signup</h1>

//         {success && (
//           <p className="text-green-500 text-sm text-center mb-4">{success}</p>
//         )}
//         {error && (
//           <p className="text-red-500 text-sm text-center mb-4">{error}</p>
//         )}

//         <form onSubmit={handleSignup} className="space-y-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
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
//             Signup
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm text-gray-600">
//           Already have an account?{" "}
//           <Link to="/" className="text-indigo-600 font-semibold">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;