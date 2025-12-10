import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
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
          className="bg-green-500 cursor-pointer text-black font-semibold p-3 rounded-full mt-2"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
