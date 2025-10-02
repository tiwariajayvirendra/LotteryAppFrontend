import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Sub-component for displaying a single ticket
const TicketItem = ({ ticket }) => (
  <div className="bg-gray-50 border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow duration-300">
    <div className="flex-grow">
      <p className="font-semibold">
        Ticket #: <span className="font-mono text-lg text-blue-700">{ticket.ticketNumber}</span>
      </p>
      <p className="text-sm text-gray-600">
        <strong>Purchased:</strong> {new Date(ticket.purchaseDate).toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Skim ID:</strong> {ticket.skimId || 'N/A'}
      </p>
    </div>
    <a
      href={`${backendUrl}${ticket.downloadLink}`}
      download={`ticket_${ticket.ticketNumber}.png`}
      className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 self-end sm:self-center"
    >
      Download
    </a>
  </div>
);

const FindMyTicket = () => {
  const [mobile, setMobile] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false); // Track if a search has been performed

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUser(null);

    // Validate mobile number
    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/user-tickets/${mobile}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'An error occurred.');
        // Keep user as null to indicate no results
        setUser(null);
      } else {
        setUser(data);
      }
    } catch (err) {
      setError('Could not connect to the server. Please try again later.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
      setSearched(true); // Mark that a search has been attempted
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Find Your Tickets</h1>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your 10-digit mobile number"
            className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength="10"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Results Area */}
        <div className="mt-8">
          {loading && (
            <div className="text-center text-gray-500" aria-live="polite">
              <p>Searching for tickets...</p>
            </div>
          )}

          {error && <p className="text-red-500 text-center mb-4" aria-live="assertive">{error}</p>}

          {!loading && searched && user && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Tickets for {user.fullName} ({user.mobile})</h2>
              <div className="space-y-4">
                {user.tickets
                  .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
                  .map(ticket => <TicketItem key={ticket._id} ticket={ticket} />)
                }
              </div>
            </div>
          )}

          {!loading && searched && !user && !error && (
             <p className="text-center text-gray-500">No tickets found for this mobile number.</p>
          )}
        </div>
      </div>
      <Link to="/dashboard" className="mt-8 text-indigo-600 hover:underline">
        ← Back to Dashboard
      </Link>
    </div>
  );
};

export default FindMyTicket;

/*```

#### Frontend: Add Link in `dashboardlayout.jsx`

Finally, let's add a link to this new search page in the sidebar of the dashboard.

```diff
--- a/c:\Users\ajayt\OneDrive\Desktop\LottrySpecialGame - Copy\LottrySpcial\src\layouts\dashboardlayout.jsx
+++ b/c:\Users\ajayt\OneDrive\Desktop\LottrySpecialGame - Copy\LottrySpcial\src\layouts\dashboardlayout.jsx
@@ -7,6 +7,7 @@
   const firstRowColors = ["#00C851", "#33b5e5", "#ff4444", "#ffbb33"];
   const sidebarItems = [
     { label: "Dashboard", path: "/dashboard" },
+    { label: "Find My Ticket", path: "/find-my-ticket" },
     { label: "Tickets", path: "/tickets" },
     { label: "Info", path: "/info" },
   ];

```

You will also need to add a new route for `/find-my-ticket` in your main router file (likely `App.jsx` or `main.jsx`) to render the `FindMyTicket` component.

These changes should implement all the features you requested. Let me know if you have any other questions!

<!--
[PROMPT_SUGGESTION]How can I add pagination to the admin page to handle a large number of tickets?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Can you help me deploy this MERN stack application to a cloud service like Vercel or Heroku?[/PROMPT_SUGGESTION]
-->*/