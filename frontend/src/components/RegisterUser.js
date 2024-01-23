import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch the base API URL from environment variable
      const apiUrl = process.env.REACT_APP_API_URL;

      // Make a POST request to the /auth/register endpoint
      const response = await axios.post(`${apiUrl}/auth/register`, formData);

      // Display success message using SweetAlert
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "User registered successfully.",
      });
    //   console.log("User registered successfully:", response.data);
    } catch (error) {
      
      // Display error message using SweetAlert
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response.data.message ||
          "An error occurred during registration.",
      });
    //   console.error("Error registering user:", error.response.data);
    }
  };

  return (
    <div className="w-50 m-auto my-3">
      <div className="m-auto">
        <h2>Register User</h2>
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
};

export default RegisterUser;
