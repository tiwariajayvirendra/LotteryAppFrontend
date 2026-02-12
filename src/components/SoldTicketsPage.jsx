import React, { useState, useEffect } from 'react';

// --- MOCK DATA ---
// This is temporary data so you can see the layout.
// Remove this once your backend is ready.
const MOCK_SCHEMES = [
  { id: 1, skim_no: '101' },
  { id: 2, skim_no: '102' },
  { id: 3, skim_no: '103' },
];
const SoldTicketsPage = () => {
  const [schemes, setSchemes] = useState([]); // Holds all schemes
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [soldTickets, setSoldTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Fetch all schemes when the page loads
  useEffect(() => {
    const fetchSchemes = async () => {
      // --- Using Mock Data ---
      // We are using the mock data for now.
      setSchemes(MOCK_SCHEMES);
      if (MOCK_SCHEMES.length > 0) {
        handleSchemeClick(MOCK_SCHEMES[0]);
      }

      // --- Real Fetch (Commented Out) ---
      // Once your backend is working, remove the mock data section above
      // and uncomment the lines below.
      // const response = await fetch(`${backendUrl}/api/schemes`);
      // const schemesData = await response.json();
      // setSchemes(schemesData);
      // if (schemesData && schemesData.length > 0) {
      //   handleSchemeClick(schemesData[0]);
      // }
    };
    fetchSchemes();
  }, [backendUrl]); // useEffect dependency is correct, no need to add handleSchemeClick

  // Handle clicking on a scheme to see its sold tickets
  const handleSchemeClick = async (scheme) => {
    setSelectedScheme(scheme);
    setIsLoading(true);
    // For now, this will fail because the backend isn't ready,
    // but it shows how it will work.
    // You can add mock sold tickets here too if you want.
    // This calls the backend for sold tickets of a specific scheme
    const response = await fetch(`${backendUrl}/api/schemes/${scheme.id}/sold-tickets`);
    const data = await response.json();
    setSoldTickets(data.tickets || []); // Expecting { tickets: [...] }
    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sold Numbers</h1>

      {/* Tabs for each Scheme */}
      <div className="flex justify-center border-b mb-6">
        {schemes.map((scheme) => (
          <button
            key={scheme.id}
            onClick={() => handleSchemeClick(scheme)}
            className={`py-2 px-6 font-semibold text-lg ${
              selectedScheme?.id === scheme.id
                ? 'border-b-2 border-red-600 text-red-700'
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            Scheme #{scheme.skim_no}
          </button>
        ))}
      </div>

      {/* Grid of Sold Numbers */}
      <div className="max-w-4xl mx-auto">
        {selectedScheme && (
          {isLoading ? (
            <p>Loading tickets...</p>
          ) : (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="mb-4 text-lg">Total tickets sold: <strong>{soldTickets.length}</strong></p>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 gap-2">
                {soldTickets.length > 0 ? soldTickets.map((ticket) => (
                  <div key={ticket.number} className="p-2 bg-gray-200 text-center rounded text-sm font-semibold">
                    {ticket.number}
                  </div>
                )) : <p className="col-span-full text-gray-500">No tickets have been sold for this scheme yet.</p>}
              </div>
            </div>
          )}
        )}
      </div>
    </div>
  );
};

export default SoldTicketsPage;