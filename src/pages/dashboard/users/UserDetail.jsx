import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Toaster, {
  showSuccessToast,
  showErrorToast,
} from "../../../components/Toaster";

const UserDetail = () => {
  const { id } = useParams();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = Cookies.get("token");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        console.error("Admin token is missing.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      const formData = new FormData();
      formData.append("id", id);
      formData.append("password", password);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/update-user-password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showSuccessToast("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      showErrorToast("Failed to update password");
    }
  };

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        if (!token) {
          console.error("Admin token is missing.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/influencers/id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.influencer) {
          setInfluencer(response.data.influencer);
        }
      } catch (error) {
        console.error("Error fetching influencer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencer();
  }, [id, token]);

  if (loading) return <div className="text-center p-4">Loading influencer details...</div>;
  if (!influencer) return <div className="text-center p-4 text-red-600">Influencer not found.</div>;

  const renderSection = (title, data) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/3">
                  {item.label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-2/3">
                  {item.value || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPlatforms = () => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Platforms</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {influencer.platforms && influencer.platforms.length > 0 ? (
              influencer.platforms.map((platform, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {platform}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  No platforms available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNiches = () => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Niches</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niche
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {influencer.niches && influencer.niches.length > 0 ? (
              influencer.niches.map((niche, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {niche}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  No niches available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Statistics</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/3">
                Followers
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-2/3">
                {influencer.stats?.followers?.toLocaleString() || "N/A"}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Average Views
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {influencer.stats?.avgViews?.toLocaleString() || "N/A"}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Engagement Rate
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {influencer.stats?.engagementRate ? `${influencer.stats.engagementRate}%` : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const influencerDetails = [
    { label: "ID", value: influencer.id },
    { label: "Name", value: influencer.name },
    { label: "Slug", value: influencer.slug },
    { label: "Bio", value: influencer.bio },
    { label: "Created At", value: new Date(influencer.createdAt).toLocaleDateString() },
  ];

  return (
    <>
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Influencer Details (ID: {influencer.id})</h2>

        <div className="mb-8 flex items-center gap-6">
          <img
            src={`${import.meta.env.VITE_BASE_URL_IMAGE}${influencer.avatarUrl}`}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/128";
            }}
          />
          <div>
            <h3 className="text-lg font-medium text-gray-700">Profile Image</h3>
          </div>
        </div>

        {renderSection("Influencer Information", influencerDetails)}
        {renderStats()}
        {renderPlatforms()}
        {renderNiches()}
      </div>
      
      {/* Update password form - You might want to reconsider if this is needed for influencers */}
      <div className="p-6 max-w-3xl mx-auto border rounded-lg shadow-md bg-white mt-8">
        <h2 className="text-2xl font-semibold mb-4">Update Password</h2>
        <form
          onSubmit={handleUpdatePassword}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* New Password */}
          <div>
            <label className="block font-medium mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="sm:col-span-2 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserDetail;