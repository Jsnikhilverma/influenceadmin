import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

const ProjectDetail = () => {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/clients/projects/id/${id}`,
          { id }, // Send ID in the request body
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch project data");
        }

        const data = response.data;
        setProjectData(data.project);
      } catch (err) {
        setError("Failed to fetch project data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [token, id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!projectData) return <ErrorState error="Project not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{projectData.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              projectData.status === "open" 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {projectData.status.charAt(0).toUpperCase() + projectData.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Project Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-800">{projectData.description}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Budget Range</p>
                  <p className="text-gray-800">
                    ₹{projectData.budgetMin?.toLocaleString() || 0} - ₹{projectData.budgetMax?.toLocaleString() || 0}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="text-gray-800">{projectData.client?.name || "N/A"}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Project Specifications</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Platforms</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {projectData.platforms?.map((platform, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {platform}
                      </span>
                    )) || <span className="text-gray-500">No platforms specified</span>}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Niches</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {projectData.niches?.map((niche, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        {niche}
                      </span>
                    )) || <span className="text-gray-500">No niches specified</span>}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-gray-800">
                    {projectData.createdAt ? new Date(projectData.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;