import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardBody, CardHeader, Typography, Spinner } from "@material-tailwind/react";

function CollaborationRequests() {
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/collaboration-requests`,
          { headers }
        );
        setRows(Array.isArray(data?.data) ? data.data : []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant="h5">Collaboration Requests</Typography>
        <Typography color="gray" className="mt-1">Influencer inbound requests</Typography>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="p-2 border-b">Sender</th>
                  <th className="p-2 border-b">Recipient</th>
                  <th className="p-2 border-b">Project</th>
                  <th className="p-2 border-b">Message</th>
                  <th className="p-2 border-b">Created</th>
                  <th className="p-2 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id}>
                    <td className="p-2 border-b">{r.meta?.senderName || r.influencer?.name || "N/A"}</td>
                    <td className="p-2 border-b">{r.influencer?.name || "N/A"}</td>
                    <td className="p-2 border-b">{r.project?.title || r.project || "N/A"}</td>
                    <td className="p-2 border-b">{r.message || ""}</td>
                    <td className="p-2 border-b">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</td>
                    <td className="p-2 border-b text-right">
                      <a href={`/dashboard/collaboration-requests/${r._id}`} className="text-blue-600 hover:underline">View</a>
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

export default CollaborationRequests; 