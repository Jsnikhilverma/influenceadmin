import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // For storing JWT token

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Both email and password are required.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/login`, // ✅ Direct API
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
         // include cookies if backend sets them
        }
      );

      console.log("Response:", res.data);

      if (res.data.success) {
        console.log("Login Success");

        const token = res.data.token;

        // Store token in cookies
        Cookies.set("token", token, {
          expires: 7, // 7 days
          secure: false, // set true in production with HTTPS
          sameSite: "Strict",
        });

        console.log("Token saved in cookies");

        // Redirect to dashboard
        navigate("/");
      } else {
        alert("Login failed! Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred during login. Please try again."
      );
    }
  };

  return (
    <div className="lg:flex min-h-screen">
      <div className="lg:w-1/2 xl:max-w-screen-sm">
        <div className="py-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
          <div className="cursor-pointer flex items-center">
            <div className="text-3xl text-indigo-800 tracking-wide ml-2 font-semibold">
              InfluencerHub Admin
            </div>
          </div>
        </div>
        <div className="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 xl:px-24 xl:max-w-2xl">
          <h2 className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl">
            Log in
          </h2>
          <form className="mt-12" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-bold text-gray-700">
                Email Address
              </label>
              <input
                className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                type="email"
                placeholder="mike@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-8">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">
                  Password
                </label>
              </div>
              <input
                className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mt-10">
              <button
                type="submit"
                className="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold hover:bg-indigo-600 shadow-lg"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-center bg-indigo-100 flex-1 h-screen">
        {/* You can add an image or illustration here */}
      </div>
    </div>
  );
};

export default Login;
