import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardBody, CardHeader, Typography, Spinner, Button } from "@material-tailwind/react";

const API = import.meta.env.VITE_BASE_URL;

function Brands() {
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", description: "", logoUrl: "", website: "" });

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/brands`);
      setRows(Array.isArray(data?.data) ? data.data : data?.brands || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`${API}/brands/${form.id}`, { name: form.name, description: form.description, logoUrl: form.logoUrl, website: form.website }, { headers });
      } else {
        await axios.post(`${API}/brands`, { name: form.name, description: form.description, logoUrl: form.logoUrl, website: form.website }, { headers });
      }
      setForm({ id: "", name: "", description: "", logoUrl: "", website: "" });
      fetchBrands();
    } catch {
      // handle error
    }
  };

  const onEdit = (b) => {
    setForm({ id: b._id, name: b.name || "", description: b.description || "", logoUrl: b.logoUrl || "", website: b.website || "" });
  };

  const onCancel = () => setForm({ id: "", name: "", description: "", logoUrl: "", website: "" });

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant="h5">Brands</Typography>
        <Typography color="gray" className="mt-1">Create and manage brands</Typography>
      </CardHeader>
      <CardBody>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <input className="border rounded px-3 py-2 md:col-span-1" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="border rounded px-3 py-2 md:col-span-1" placeholder="Logo URL" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
          <input className="border rounded px-3 py-2 md:col-span-1" placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          <div className="md:col-span-5 flex gap-2">
            <Button type="submit" color="blue">{form.id ? "Update" : "Add"}</Button>
            {form.id && <Button type="button" color="gray" onClick={onCancel}>Cancel</Button>}
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="p-2 border-b">Logo</th>
                  <th className="p-2 border-b">Name</th>
                  <th className="p-2 border-b">Description</th>
                  <th className="p-2 border-b">Website</th>
                  <th className="p-2 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b._id}>
                    <td className="p-2 border-b"><img src={b.logoUrl || ""} alt="" className="h-8 w-8 object-cover rounded" /></td>
                    <td className="p-2 border-b">{b.name}</td>
                    <td className="p-2 border-b">{b.description}</td>
                    <td className="p-2 border-b"><a href={b.website} target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">{b.website}</a></td>
                    <td className="p-2 border-b text-right">
                      <button className="text-blue-600 hover:underline" onClick={() => onEdit(b)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default Brands; 