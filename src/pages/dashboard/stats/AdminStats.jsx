import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardBody, CardHeader, Typography, Spinner } from "@material-tailwind/react";

function StatTile(props) {
  const title = props.title;
  const value = props.value;
  return (
    <div className="p-4 border rounded-md">
      <Typography variant="small" className="text-slate-500">{title}</Typography>
      <Typography variant="h5">{value}</Typography>
    </div>
  );
}

function AdminStats() {
  const token = Cookies.get("token");

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [topProjects, setTopProjects] = useState([]);
  const [clientProjects, setClientProjects] = useState([]);
  const [requestsByInfluencer, setRequestsByInfluencer] = useState([]);
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [ov, top, cli, reqs, asg] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/admin/stats/overview`, { headers }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/admin/stats/top-projects`, { headers }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/admin/stats/client-project-counts`, { headers }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/admin/stats/requests-per-influencer`, { headers }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/admin/stats/assigned-projects`, { headers }),
        ]);
        setOverview(ov.data);
        setTopProjects(top.data?.data || []);
        setClientProjects(cli.data?.data || []);
        setRequestsByInfluencer(reqs.data?.data || []);
        setAssigned(asg.data?.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant="h5">Admin Analytics</Typography>
        <Typography color="gray" className="mt-1">Track requests, bids, assignments</Typography>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatTile title="Influencers" value={overview?.influencerCount ?? 0} />
              <StatTile title="Clients" value={overview?.clientCount ?? 0} />
              <StatTile title="Projects" value={overview?.totalProjects ?? 0} />
              <StatTile title="Bids" value={overview?.totalBids ?? 0} />
              <StatTile title="Collab Requests" value={overview?.totalRequests ?? 0} />
            </div>

            <section>
              <Typography variant="h6" className="mb-2">Top Projects by Bids</Typography>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Project</th>
                      <th className="p-2 border-b">Bids</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProjects.map((row) => (
                      <tr key={row._id}>
                        <td className="p-2 border-b">{row.project?.title || row._id}</td>
                        <td className="p-2 border-b">{row.bidCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <Typography variant="h6" className="mb-2">Projects per Client</Typography>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Client Id</th>
                      <th className="p-2 border-b">Projects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientProjects.map((row) => (
                      <tr key={row._id}>
                        <td className="p-2 border-b">{row._id}</td>
                        <td className="p-2 border-b">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <Typography variant="h6" className="mb-2">Requests per Influencer</Typography>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Influencer Id</th>
                      <th className="p-2 border-b">Requests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestsByInfluencer.map((row) => (
                      <tr key={row._id}>
                        <td className="p-2 border-b">{row._id}</td>
                        <td className="p-2 border-b">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <Typography variant="h6" className="mb-2">Assigned Projects</Typography>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Project</th>
                      <th className="p-2 border-b">Client</th>
                      <th className="p-2 border-b">Influencer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assigned.map((p) => (
                      <tr key={p._id}>
                        <td className="p-2 border-b">{p.title || p._id}</td>
                        <td className="p-2 border-b">{p.client?.name || p.client}</td>
                        <td className="p-2 border-b">{p.assignedInfluencer?.name || p.assignedInfluencer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default AdminStats; 