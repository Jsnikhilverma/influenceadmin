import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API = import.meta.env.VITE_BASE_URL;

export default function Payments() {
  const token = Cookies.get("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ influencer: "", client: "", project: "", totalAmount: "", currency: "INR", notes: "" });
  const [tx, setTx] = useState({ id: "", amount: "", note: "", reference: "" });

  const [infOptions, setInfOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [infQuery, setInfQuery] = useState("");
  const [clientQuery, setClientQuery] = useState("");
  const [projectQuery, setProjectQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/admin/payments`, { headers });
      setRows(Array.isArray(data?.data) ? data.data : []);
    } finally {
      setLoading(false);
    }
  };

  const searchInfluencers = async (q) => {
    const { data } = await axios.get(`${API}/influencers`, { params: { q } });
    const arr = Array.isArray(data?.data) ? data.data : data?.influencers || [];
    setInfOptions(arr.map((u) => ({ id: u._id || u.id, name: u.name })));
  };
  const searchClients = async (q) => {
    const { data } = await axios.get(`${API}/clients/filter`, { params: { q } });
    const arr = Array.isArray(data?.data) ? data.data : data?.clients || [];
    setClientOptions(arr.map((u) => ({ id: u._id || u.id, name: u.name })));
  };
  const searchProjects = async (q) => {
    const { data } = await axios.get(`${API}/projects`, { params: { q } });
    const arr = Array.isArray(data?.data) ? data.data : data?.projects || [];
    setProjectOptions(arr.map((p) => ({ id: p._id || p.id, name: p.title })));
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { searchInfluencers(infQuery); }, [infQuery]);
  useEffect(() => { searchClients(clientQuery); }, [clientQuery]);
  useEffect(() => { searchProjects(projectQuery); }, [projectQuery]);

  const createPayment = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/admin/payments`, { ...form, totalAmount: Number(form.totalAmount) }, { headers });
    setForm({ influencer: "", client: "", project: "", totalAmount: "", currency: "INR", notes: "" });
    fetchData();
  };

  const addTx = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/admin/payments/${tx.id}/transactions`, { amount: Number(tx.amount), note: tx.note, reference: tx.reference }, { headers });
    setTx({ id: "", amount: "", note: "", reference: "" });
    fetchData();
  };

  const markPaid = async (id) => {
    await axios.post(`${API}/admin/payments/${id}/mark-paid`, {}, { headers });
    fetchData();
  };

  return (
    <div className="p-4 space-y-6">
      <div className="border rounded p-4">
        <div className="font-semibold mb-3">Create Deal Payment</div>
        <form onSubmit={createPayment} className="grid grid-cols-1 md:grid-cols-8 gap-2">
          <div className="md:col-span-2">
            <input className="border rounded px-3 py-2 w-full" placeholder="Search Influencer" value={infQuery} onChange={(e) => setInfQuery(e.target.value)} />
            <select className="border rounded px-3 py-2 w-full mt-1" value={form.influencer} onChange={(e) => setForm({ ...form, influencer: e.target.value })}>
              <option value="">Select Influencer</option>
              {infOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <input className="border rounded px-3 py-2 w-full" placeholder="Search Client" value={clientQuery} onChange={(e) => setClientQuery(e.target.value)} />
            <select className="border rounded px-3 py-2 w-full mt-1" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })}>
              <option value="">Select Client</option>
              {clientOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <input className="border rounded px-3 py-2 w-full" placeholder="Search Project" value={projectQuery} onChange={(e) => setProjectQuery(e.target.value)} />
            <select className="border rounded px-3 py-2 w-full mt-1" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}>
              <option value="">Select Project</option>
              {projectOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
          <input className="border rounded px-3 py-2" placeholder="Total Amount" type="number" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} required />
          <input className="border rounded px-3 py-2" placeholder="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
          <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="md:col-span-8 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
          </div>
        </form>
      </div>

      <div className="border rounded p-4">
        <div className="font-semibold mb-3">Add Payment Transaction</div>
        <form onSubmit={addTx} className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <input className="border rounded px-3 py-2" placeholder="Payment ID" value={tx.id} onChange={(e) => setTx({ ...tx, id: e.target.value })} required />
          <input className="border rounded px-3 py-2" placeholder="Amount" type="number" value={tx.amount} onChange={(e) => setTx({ ...tx, amount: e.target.value })} required />
          <input className="border rounded px-3 py-2" placeholder="Reference" value={tx.reference} onChange={(e) => setTx({ ...tx, reference: e.target.value })} />
          <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Note" value={tx.note} onChange={(e) => setTx({ ...tx, note: e.target.value })} />
          <div className="md:col-span-1 flex justify-end">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded">Add</button>
          </div>
        </form>
      </div>

      <div className="border rounded p-4">
        <div className="font-semibold mb-3">Payments</div>
        {loading ? (
          <div className="h-32 flex items-center justify-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="p-2 border-b">Payment ID</th>
                  <th className="p-2 border-b">Project</th>
                  <th className="p-2 border-b">Influencer</th>
                  <th className="p-2 border-b">Client</th>
                  <th className="p-2 border-b">Total</th>
                  <th className="p-2 border-b">Paid</th>
                  <th className="p-2 border-b">Remaining</th>
                  <th className="p-2 border-b">Status</th>
                  <th className="p-2 border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p._id}>
                    <td className="p-2 border-b">{p.paymentId}</td>
                    <td className="p-2 border-b">{p.project?.title}</td>
                    <td className="p-2 border-b">{p.influencer?.name}</td>
                    <td className="p-2 border-b">{p.client?.name}</td>
                    <td className="p-2 border-b">{p.totalAmount} {p.currency}</td>
                    <td className="p-2 border-b">{p.amountPaid}</td>
                    <td className="p-2 border-b">{Math.max(0, p.totalAmount - (p.amountPaid || 0))}</td>
                    <td className="p-2 border-b capitalize">{p.status}</td>
                    <td className="p-2 border-b text-right">
                      {p.status !== "paid" ? (
                        <button className="px-3 py-1 bg-amber-500 text-black rounded" onClick={() => markPaid(p._id)}>Mark Final Paid</button>
                      ) : (
                        <span className="text-xs text-gray-500">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 