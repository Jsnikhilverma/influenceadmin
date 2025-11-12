import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";
import { useNavigate } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ViewIcon } from "lucide-react";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = Cookies.get("token");
  const navigate = useNavigate();

  const fetchUsers = useCallback(
    async (page) => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/influencers?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        setUsers(data.influencers || []);
        // If your API returns pagination info, use it here
        // setTotalPages(data.pagination.totalPages);
        
        // For now, let's assume we have 5 pages as we don't have pagination info
        setTotalPages(5);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/influencers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/user-detail/${id}`);
  };

  const handleOrder = (id) => {
    navigate(`/user-order/${id}`);
  };

  // Add numbering to the data before passing to CustomTable
  const numberedUsers = users.map((user, index) => ({
    ...user,
    rowNumber: (currentPage - 1) * 10 + index + 1,
  }));

  const columns = [
    {
      key: "rowNumber",
      label: "S.No.",
      render: (row) => <div>{row.rowNumber}</div>,
      width: "w-12",
    },
    {
      key: "name",
      label: "Name",
      render: (row) => <div>{row.name || "N/A"}</div>,
      width: "w-48",
    },
    {
      key: "platforms",
      label: "Platforms",
      render: (row) => (
        <div>
          {row.platforms && row.platforms.length > 0 
            ? row.platforms.join(", ") 
            : "N/A"}
        </div>
      ),
      width: "w-48",
    },
    {
      key: "niches",
      label: "Niches",
      render: (row) => (
        <div>
          {row.niches && row.niches.length > 0 
            ? row.niches.join(", ") 
            : "N/A"}
        </div>
      ),
      width: "w-48",
    },
    {
      key: "followers",
      label: "Followers",
      render: (row) => <div>{row.stats?.followers?.toLocaleString() || "0"}</div>,
      width: "w-32",
    },
    {
      key: "actions",
      label: "Order",
      render: (row) => (
        <div className="flex gap-2">
          <Tooltip content="order">
            <button onClick={() => handleOrder(row._id)}>
              <ViewIcon className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
        </div>
      ),
      width: "w-28",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Tooltip content="Edit">
            <button onClick={() => handleEdit(row._id)}>
              <PencilIcon className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button onClick={() => deleteUser(row._id)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </Tooltip>
        </div>
      ),
      width: "w-28",
    },
  ];

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              User List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View the current active Users
            </Typography>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <CustomTable columns={columns} data={numberedUsers} />
        )}
      </CardBody>

      <CardFooter className="flex justify-between">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}>
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentPage > 3 && (
            <>
              <IconButton
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(1)}>
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
                disabled={currentPage === page}>
                {page}
              </IconButton>
            );
          })}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <p>...</p>}
              <IconButton
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}>
                {totalPages}
              </IconButton>
            </>
          )}
        </div>

        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Users;