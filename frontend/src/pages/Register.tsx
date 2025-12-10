import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    setRegisterLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/v1/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black">
      <form
        onSubmit={handleRegister}
        className="bg-transparent flex flex-col gap-4 w-96"
      >
        <h2 className="text-white text-2xl font-bold text-center">
          Register to Spotify
        </h2>

        <label className="text-white text-sm">Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full p-3 rounded-lg bg-[#1f2937] text-white outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="text-white text-sm">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 rounded-lg bg-[#1f2937] text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-white text-sm">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-3 rounded-lg bg-[#1f2937] text-white outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className={`bg-green-500 text-black font-semibold p-3 rounded-full mt-2 ${
            registerLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={registerLoading}
        >
          {registerLoading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="text-white mt-4">
        Already have an account? <Link to="/login" className="text-green-500">Login</Link>
      </p>
    </div>
  );
};

export default Register;
