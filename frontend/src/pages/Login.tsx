import React, { useState } from "react";
import { useUserData } from "../Context/UserContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loginLoading } = useUserData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    await login(email, password);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-transparent flex flex-col gap-4 w-96"
      >
        <h2 className="text-white text-2xl font-bold text-center">
          Login To Spotify
        </h2>

        <label className="text-white text-sm">Email or username</label>
        <input
          type="text"
          placeholder="Email or username"
          className="w-full p-3 rounded-lg bg-[#1f2937] text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-white text-sm">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          className="w-full p-3 rounded-lg bg-[#1f2937] text-white outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className={`bg-green-500 text-black font-semibold p-3 rounded-full mt-2 ${
            loginLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={loginLoading}
        >
          {loginLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-white mt-4">
        Don't have an account?{" "}
        <Link to={"/register"} className="text-green-500">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
