import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Your login logic here

    // After successful login, navigate to the desired page
    navigate("/dashboard"); // Replace with the path you want to navigate to
  };

  return (
    <div>
      {/* Your login form */}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
