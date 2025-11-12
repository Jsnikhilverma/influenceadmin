import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardBody, CardHeader, Typography, Spinner, Button } from "@material-tailwind/react";

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/clients/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );
        setClient(data?.data || null);
      } catch {
        setError("Failed to load client details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClient();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Typography color="red" className="mb-4">{error}</Typography>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <Typography>No client found.</Typography>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              Client Details
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View full information of the client
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button color="blue" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <img
              src={`${import.meta.env.VITE_BASE_URL_IMAGE}${client.avatarUrl}`}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <Typography variant="h6">{client.name || "N/A"}</Typography>
              <Typography color="gray" className="text-sm">{client.email || "N/A"}</Typography>
              <Typography color="gray" className="text-sm">Slug: {client.slug || "N/A"}</Typography>
              <Typography color="gray" className="text-sm">Role: {client.role || "N/A"}</Typography>
            </div>
          </div>

          <div>
            <Typography variant="small" className="text-slate-500">Bio</Typography>
            <Typography className="mt-1">{client.bio || "N/A"}</Typography>
          </div>

          <div>
            <Typography variant="small" className="text-slate-500">Created At</Typography>
            <Typography className="mt-1">{client.createdAt ? new Date(client.createdAt).toLocaleString() : "N/A"}</Typography>
          </div>

          <div>
            <Typography variant="small" className="text-slate-500">Updated At</Typography>
            <Typography className="mt-1">{client.updatedAt ? new Date(client.updatedAt).toLocaleString() : "N/A"}</Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default ClientDetail; 