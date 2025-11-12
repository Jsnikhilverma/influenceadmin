import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const ContactUsQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/queries`
        );
        const rows = Array.isArray(response.data?.data) ? response.data.data : (response.data?.queries || []);
        setQueries(rows);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQueries();
  }, [token]);

  const filteredQueries = queries.filter((query) => {
    const name = (query.name || '').toLowerCase();
    const email = (query.email || '').toLowerCase();
    const subject = (query.subject || '').toLowerCase();
    const message = (query.message || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || email.includes(q) || subject.includes(q) || message.includes(q);
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Us Queries</h1>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search queries by name, email, subject or message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredQueries.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No queries found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQueries.map((query) => (
                  <tr key={query._id || query.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{query.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{query.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{query.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate" title={query.message}>{query.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">{query.status || 'new'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(query.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-blue-600 hover:underline" onClick={() => navigate(`/dashboard/query/${query._id || query.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {filteredQueries.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredQueries.length} of {queries.length} queries
        </div>
      )}
    </div>
  );
};

export default ContactUsQueries;