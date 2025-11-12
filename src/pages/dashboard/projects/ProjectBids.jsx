import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardBody, CardHeader, Typography, Spinner, Button, Chip } from "@material-tailwind/react";

function ProjectBids() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/projects/${projectId}/bids`,
          { headers }
        );
        setData(data);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchData();
  }, [projectId, token]);

  const statusColor = (s) =>
    s === "accepted" ? "green" : s === "rejected" ? "red" : s === "withdrawn" ? "gray" : "blue";

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5">Project Bids</Typography>
            <Typography color="gray" className="mt-1">
              {data?.project?.title || ""}
            </Typography>
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-3 border rounded">
                <Typography variant="small" className="text-slate-500">Total</Typography>
                <Typography variant="h6">{data?.counts?.total || 0}</Typography>
              </div>
              <div className="p-3 border rounded">
                <Typography variant="small" className="text-slate-500">Pending</Typography>
                <Typography variant="h6">{data?.counts?.pending || 0}</Typography>
              </div>
              <div className="p-3 border rounded">
                <Typography variant="small" className="text-slate-500">Accepted</Typography>
                <Typography variant="h6">{data?.counts?.accepted || 0}</Typography>
              </div>
              <div className="p-3 border rounded">
                <Typography variant="small" className="text-slate-500">Rejected</Typography>
                <Typography variant="h6">{data?.counts?.rejected || 0}</Typography>
              </div>
            </div>

            {data?.acceptedInfluencer && (
              <div className="p-3 border rounded">
                <Typography variant="small" className="text-slate-500">Accepted Influencer</Typography>
                <Typography variant="h6">{data.acceptedInfluencer.name} ({data.acceptedInfluencer.email})</Typography>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="p-2 border-b">Influencer</th>
                    <th className="p-2 border-b">Amount</th>
                    <th className="p-2 border-b">Message</th>
                    <th className="p-2 border-b">Status</th>
                    <th className="p-2 border-b">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.bids || []).map((b) => (
                    <tr key={b._id}>
                      <td className="p-2 border-b">{b.influencer?.name} ({b.influencer?.email})</td>
                      <td className="p-2 border-b">{b.amount}</td>
                      <td className="p-2 border-b">{b.message || ""}</td>
                      <td className="p-2 border-b"><Chip size="sm" color={statusColor(b.status)} value={b.status} /></td>
                      <td className="p-2 border-b">{b.createdAt ? new Date(b.createdAt).toLocaleString() : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default ProjectBids; 