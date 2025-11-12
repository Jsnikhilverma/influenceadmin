import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Typography,
  Spinner,
  Tooltip,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";
import { useNavigate } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");
  const navigate = useNavigate();

  const fetchProjects = useCallback(
    async (page) => {
      if (!token) return;

      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/clients/projects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (data && data.projects) {
          // Add index to each project based on pagination
          const projectsWithIndex = data.projects.map((project, index) => ({
            ...project,
            index: (page - 1) * 10 + index + 1,
          }));
          setProjects(projectsWithIndex);
          // Since the API doesn't provide pagination info, we'll assume 1 page
          setTotalPages(1);
        } else {
          setProjects([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to fetch projects. Please try again.");
        setProjects([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) fetchProjects(currentPage);
  }, [token, currentPage, fetchProjects]);

  const deleteProject = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/clients/projects/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects(projects.filter((project) => project._id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project. Please try again.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/product-order-detail/${id}`);
  };

  const columns = [
    {
      key: "index",
      label: "S.No.",
      render: (row) => <div>{row.index}</div>,
      width: "w-12",
    },
    {
      key: "_id",
      label: "Project ID",
      render: (row) => <div className="truncate">{row._id || "N/A"}</div>,
      width: "w-60",
    },
    {
      key: "client_name",
      label: "Client Name",
      render: (row) => <div>{row.client?.name || "N/A"}</div>,
      width: "w-48",
    },
    {
      key: "title",
      label: "Project Title",
      render: (row) => <div>{row.title || "N/A"}</div>,
      width: "w-48",
    },
    {
      key: "createdAt",
      label: "Created Date",
      render: (row) => (
        <div>
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}
        </div>
      ),
      width: "w-40",
    },
    {
      key: "budget",
      label: "Budget Range",
      render: (row) => (
        <div>
          {row.budgetMin || row.budgetMax
            ? `${row.budgetMin || 0} - ${row.budgetMax || 0}`
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
      key: "status",
      label: "Status",
      render: (row) => {
        let statusClass = "text-gray-700";
        
        if (row.status === "open") {
          statusClass = "text-green-500 font-medium";
        } else if (row.status === "closed") {
          statusClass = "text-red-500 font-medium";
        }
        
        return (
          <div className={statusClass}>
            {row.status ? row.status.toUpperCase() : "N/A"}
          </div>
        );
      },
      width: "w-32",
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
            <button onClick={() => deleteProject(row._id)}>
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
              Projects List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View all client projects
            </Typography>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center text-red-500">
            {error}
          </div>
        ) : projects && projects.length > 0 ? (
          <CustomTable columns={columns} data={projects} />
        ) : (
          <div className="flex justify-center items-center text-gray-500">
            No projects available.
          </div>
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

export default Projects;