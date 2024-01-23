import React, { useState } from "react";
import api from "./api";

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    role: "",
  });

  const handleRegister = async () => {
    try {
      const response = await api.post("/auth/register", userInfo);
      // Handle successful registration, redirect, show message, etc.
    } catch (error) {
      console.error("Registration failed:", error.message);
      // Handle error, show message to the user, etc.
    }
  };

  return (
    <div>
      <h2>User Registration</h2>
      <input
        type="text"
        placeholder="Username"
        value={userInfo.username}
        onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={userInfo.password}
        onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
      />
      <select
        value={userInfo.role}
        onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
