import React from "react";

const AuthLayout = ({ title, children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;