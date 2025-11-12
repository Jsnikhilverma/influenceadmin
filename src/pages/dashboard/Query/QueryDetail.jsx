import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardBody, CardHeader, Typography, Spinner, Button } from "@material-tailwind/react";

function QueryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/queries/${id}`);
        setData(data?.data || null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5">Query Details</Typography>
            <Typography color="gray" className="mt-1">Contact form submission</Typography>
          </div>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </div>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : data ? (
          <div className="space-y-2">
            <Typography><span className="font-semibold">Name:</span> {data.name}</Typography>
            <Typography><span className="font-semibold">Email:</span> {data.email}</Typography>
            <Typography><span className="font-semibold">Subject:</span> {data.subject}</Typography>
            <Typography><span className="font-semibold">Status:</span> {data.status}</Typography>
            <Typography><span className="font-semibold">Message:</span></Typography>
            <Typography className="whitespace-pre-wrap">{data.message}</Typography>
            <Typography color="gray">Created: {data.createdAt ? new Date(data.createdAt).toLocaleString() : ''}</Typography>
          </div>
        ) : (
          <Typography>No data found.</Typography>
        )}
      </CardBody>
    </Card>
  );
}

export default QueryDetail; 