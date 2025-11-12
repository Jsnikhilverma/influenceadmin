import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Spinner,
  //   Progress,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
// import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon, FolderIcon } from "@heroicons/react/24/solid";

function Susbscriber() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(""); // Added search filter
  const [isLoading, setIsLoading] = useState(false);
  // State for single filter dropdown
  //   const [filter, setFilter] = useState("");

  const token = Cookies.get("token");

  const navigate = useNavigate(); // Initialize navigate

  const fetchUsers = useCallback(
    async (page) => {
      setIsLoading(true);
      try {
        const limit = 10;
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/clients`,
          {
            params: {
              page,
              limit,
              q: search || undefined,
            },
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : undefined,
          }
        );

        const rows = Array.isArray(data?.data) ? data.data : [];
        setUsers(rows);

        const total = data?.pagination?.total ?? rows.length;
        setTotalPages(Math.max(1, Math.ceil(total / limit)));
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [token, search]
  );

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  //   const handleFilterChange = (e) => {
  //     setFilter(e.target.value); // Update filter state
  //   };

  // const handleSearch = () => {
  //   // Only fetch users when the search button is clicked
  //   setCurrentPage(1); // Reset to the first page on new search
  //   fetchUsers(1); // Fetch users for the first page with the current search and filter
  // };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/clients/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edituser/${id}`); // Redirect to detail page with ID
  };

  const columns = [
    {
      key: "avatarUrl",
      label: "Profile",
      render: (row) => (
        <div className="w-8 h-8 rounded-full object-cover overflow-hidden">
          <img src={row.avatarUrl || "default-avatar.png"} alt="Avatar" />
        </div>
      ),
      width: "w-12",
    },
    {
      key: "name",
      label: "Name",
      render: (row) => <div title={row.name}>{row.name || "N/A"}</div>,
      width: "w-70",
    },
    {
      key: "email",
      label: "Email",
      render: (row) => <div title={row.email}>{row.email || "N/A"}</div>,
      width: "w-52",
    },
    {
      key: "mobile",
      label: "Mobile",
      render: () => <div>N/A</div>,
      width: "w-48",
    },
    {
      key: "subscription",
      label: "Subscription",
      render: () => <div>N/A</div>,
      width: "w-32",
    },
    {
      key: "createdAt",
      label: "Start Date",
      render: (row) => {
        const date = row?.createdAt ? new Date(row.createdAt) : null;
        if (!date) return <div>N/A</div>;
        const formattedDate = `${date
          .getDate()
          .toString()
          .padStart(2, "0")}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getFullYear()} ${date
          .getHours()
          .toString()
          .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
        return <div>{formattedDate}</div>;
      },
      width: "w-48",
    },
    {
      key: "updatedAt",
      label: "End Date",
      render: (row) => {
        const date = row?.updatedAt ? new Date(row.updatedAt) : null;
        if (!date) return <div>N/A</div>;
        const formattedDate = `${date
          .getDate()
          .toString()
          .padStart(2, "0")}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getFullYear()} ${date
          .getHours()
          .toString()
          .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
        return <div>{formattedDate}</div>;
      },
      width: "w-48",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="px-4 py-2 flex gap-3 items-center">
          <Tooltip content="Projects">
            <button onClick={() => navigate(`/client/${row.id || row._id}/projects`)}>
              <FolderIcon className="h-5 w-5 text-amber-600" />
            </button>
          </Tooltip>
          <Tooltip content="Edit">
            <button onClick={() => navigate(`/client/${row.id || row._id}`)}>
              <PencilIcon className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button onClick={() => handleDelete(row.id || row._id)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </Tooltip>
        </div>
      ),
      width: "w-40",
    },
  ];

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              Subscribers List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View the current active Subscribers
            </Typography>
          </div>
          <div className="flex gap-2">
            {/* <select
              onChange={handleFilterChange}
              value={filter}
              className="border border-slate-200 rounded-md  p-1 shadow-sm "
            >
              <option value="">Select Filter</option>
              <option value="client">Client</option>
              <option value="professional">professional</option>
              <option value="subscriber">Subscriber</option>
              <option value="agency">Agency</option>
            </select> */}

            <div className="relative flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name or email"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
            </div>
            <Link to="/addsubscriber">
              <Button color="blue">Add Subscriber</Button>
            </Link>
            {/* <Button variant="gradient" >
              Search
            </Button> */}
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <CustomTable columns={columns} data={users} />
        )}
      </CardBody>

      <CardFooter className="flex justify-between">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentPage > 3 && (
            <>
              <IconButton variant="text" size="sm" onClick={() => setCurrentPage(1)}>
                1
              </IconButton>
              {currentPage > 4 && <p>...</p>}
            </>
          )}

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.max(1, currentPage - 2) + i;
            if (page > totalPages) return null;
            return (
              <IconButton
                key={page}
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(page)}
                disabled={currentPage === page}
              >
                {page}
              </IconButton>
            );
          })}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <p>...</p>}
              <IconButton variant="text" size="sm" onClick={() => setCurrentPage(totalPages)}>
                {totalPages}
              </IconButton>
            </>
          )}
        </div>

        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Susbscriber;