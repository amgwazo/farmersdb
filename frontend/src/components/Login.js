import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import {  useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  

  const [userData, setUserData] = useState({
    username: "",
    password: "",
   
  });

  const [validationErrors, setValidationErrors] = useState({
    username: "",
    password: "",
  });     


  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!userData.username || !userData.password ) {
      setValidationErrors({
        username: !userData.username ? "Username is required" : "",
        password: !userData.password ? "Password is required" : "",
      });
      return;
    }



    try {
      const apiUrl = process.env.REACT_APP_API_URL;

        // Register new user if no user ID is present
      // const response =  await axios.post(`${apiUrl}/auth/login`, userData
      await axios.post(`${apiUrl}/auth/login`, userData);

         // Redirect to the Users component after registration/update
      navigate("/"); 
     
    } catch (error) {
      console.error("Error during Login:", error);
    }
  };

  return (
    <div className="container  w-50 bg-dark p-3  rounded my-1">
      <h5 className="my-0 w-100 ps-2 ms-2 text-warning">{"Login"}</h5>

      <Form onSubmit={handleSubmit} className=" text-success pt-0">
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            isInvalid={!!validationErrors.username}
            required
            className="ps-1 "
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.username}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            isInvalid={!!validationErrors.password}
            required
            className="ps-1"
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="mt-4">
          <Button
            variant="outline-success"
            type="submit"
            className="me-3 fw-bold"
          >
            Login
          </Button>
          <Link to={`/`}>
            <Button
              variant="outline-danger"
              type="button"
              className="me-2 fw-bold"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;
