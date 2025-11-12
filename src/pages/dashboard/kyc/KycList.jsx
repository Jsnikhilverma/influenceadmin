import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API = import.meta.env.VITE_BASE_URL;

export default function KycList() {
  const token = Cookies.get("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page] = useState(1);
  const [limit] = useState(20);

  const fetchKyc = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/kyc`, { params: { q, status, page, limit }, headers });
      setRows(Array.isArray(data?.data) ? data.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKyc();
  }, [q, status, page, limit]);

  const review = async (id, action) => {
    await axios.post(`${API}/kyc/${id}/review`, { action }, { headers });
    fetchKyc();
  };

  // Hide rejected entries from the list
  const visibleRows = rows.filter((r) => r.status !== "rejected");

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <input className="border rounded px-3 py-2" placeholder="Search PAN/Aadhar" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {loading ? (
        <div className="h-40 flex items-center justify-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-2 border-b">User</th>
                <th className="p-2 border-b">PAN</th>
                <th className="p-2 border-b">Aadhar</th>
                <th className="p-2 border-b">Bank</th>
                <th className="p-2 border-b">Status</th>
                <th className="p-2 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => (
                <tr key={r._id}>
                  <td className="p-2 border-b">{r.user?.name} <div className="text-xs text-gray-500">{r.user?.email}</div></td>
                  <td className="p-2 border-b">{r.panNumber}</td>
                  <td className="p-2 border-b">{r.aadharNumber}</td>
                  <td className="p-2 border-b">{r.bankHolderName} • {r.bankIfsc}</td>
                  <td className="p-2 border-b capitalize">{r.status}</td>
                  <td className="p-2 border-b text-right space-x-2">
                    {r.status === "pending" ? (
                      <>
                        <button className="text-green-600 hover:underline" onClick={() => review(r._id, "accept")}>Accept</button>
                        <button className="text-red-600 hover:underline" onClick={() => review(r._id, "reject")}>Reject</button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 