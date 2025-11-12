import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardBody, CardHeader, Typography, Spinner, Button } from "@material-tailwind/react";

function ClientProjects() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/clients/${clientId}/projects`,
          { headers }
        );
        setRows(Array.isArray(data?.data) ? data.data : []);
      } finally {
        setLoading(false);
      }
    };
    if (clientId) fetchData();
  }, [clientId, token]);

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5">Client Projects</Typography>
            <Typography color="gray" className="mt-1">Bid counts and accepted info</Typography>
          </div>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </div>
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
                  <th className="p-2 border-b">Title</th>
                  <th className="p-2 border-b">Total Bids</th>
                  <th className="p-2 border-b">Pending</th>
                  <th className="p-2 border-b">Accepted</th>
                  <th className="p-2 border-b">Rejected</th>
                  <th className="p-2 border-b">Accepted Influencer</th>
                  <th className="p-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const total = Object.values(r.bidCounts || {}).reduce((a, b) => a + (b || 0), 0);
                  return (
                    <tr key={r.id}>
                      <td className="p-2 border-b">{r.title}</td>
                      <td className="p-2 border-b">{total}</td>
                      <td className="p-2 border-b">{r.bidCounts?.pending || 0}</td>
                      <td className="p-2 border-b">{r.bidCounts?.accepted || 0}</td>
                      <td className="p-2 border-b">{r.bidCounts?.rejected || 0}</td>
                      <td className="p-2 border-b">{r.acceptedInfluencer?.name || "-"}</td>
                      <td className="p-2 border-b">
                        <button onClick={() => navigate(`/project/${r.id}/bids`)} title="View Bids" className="p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                            <path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12zm9.75-4.125a4.125 4.125 0 1 0 0 8.25 4.125 4.125 0 0 0 0-8.25z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default ClientProjects; 