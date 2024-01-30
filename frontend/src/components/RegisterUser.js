import React, { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";  
import AuthContext from "../context/AuthProvider";

const RegisterUser = () => {
  const { userId } = useParams();  
  const navigate = useNavigate();  
  
  const { auth } = useContext(AuthContext);
  const { token } = auth;

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
    company: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Check if there's a user ID in the URL
    if (userId) {
      // Fetch user details based on the provided user id
      const fetchUserDetails = async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const response = await axios.get(
            `${apiUrl}/auth/user?searchTerm=${userId}`,
            {
              headers: {
                Authorization: `${token}`, 
              },
            }
          );
          const user = response.data;

          setUserData({
            username: user.username,
            role: user.role,
            password: "", // Don't pre-fill password for update
            confirmPassword: "",
            company: user.company,
          });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [userId, token]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!userData.username || !userData.password || !userData.confirmPassword) {
      setValidationErrors({
        username: !userData.username ? "Username is required" : "",
        password: !userData.password ? "Password is required" : "",
        confirmPassword: !userData.confirmPassword
          ? "Confirm Password is required"
          : "",
      });
      return;
    }

    if (userData.password.length < 5) {
      setValidationErrors({
        ...validationErrors,
        password: "Password should be at least 5 characters long",
      });
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setValidationErrors({
        ...validationErrors,
        confirmPassword: "Passwords do not match",
      });
      return;
    }

    try {
      // const apiUrl = process.env.REACT_APP_API_URL;
      if (userId) {
        // Update user if user ID is present in the URL
        await axios.put(`/auth/update/user?_id=${userId}`, userData, {
          headers: {
            Authorization: `${token}`, // Include your access token here
          },
        }
        );
      } else {
        // Register new user if no user ID is present
        await axios.post(`/auth/register`, userData, {
          headers: {
            Authorization: `${token}`, // Include your access token here
          },
        }
        );
      }

      // Redirect to the Users component after registration/update
      navigate("/"); // Updated usage
    } catch (error) {
      console.error("Error during registration/update:", error);
    }
  };

  return (
    <div className="container w-75 bg-light p-3 bg-dark  rounded my-1">
      <h5 className="my-0 w-100 ms-2 text-warning ps-0">
        {userId ? "Update User" : "Register User"}
      </h5>
      <Form onSubmit={handleSubmit} className="row text-success pt-0">
        <Form.Group controlId="formCompany" className="col-md-6">
          <Form.Label>User Company</Form.Label>
          <Form.Control
            as="select"
            name="company"
            value={userData.company}
            onChange={handleChange}
            className="ps-1"
          >
            <option value="">
              Select Compnay
            </option>
            <option value="Farmers Board Of Zambia">
              Farmers Board Of Zambia
            </option>
            <option value="Chilonga Milling">Chilonga Milling</option>
            <option value="Matanda Agro">Matanda Agro</option>
            <option value="Mkhuto Agriculture Services">
              Mkhuto Agriculture Services
            </option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formUsername" className="col-md-6">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            isInvalid={!!validationErrors.username}
            required
            className="ps-1"
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.username}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPassword" className="col-md-6">
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

        <Form.Group controlId="formConfirmPassword" className="col-md-6">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            isInvalid={!!validationErrors.confirmPassword}
            required
            className="ps-1"
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formRole" className="col-md-6">
          <Form.Label>User Role</Form.Label>
          <Form.Control
            as="select"
            name="role"
            value={userData.role}
            onChange={handleChange}
            className="ps-1"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Form.Control>
        </Form.Group>
        <div className="mt-4">
          <Button
            variant="outline-success"
            type="submit"
            className="me-3 fw-bold"
          >
            {userId ? "Update" : "Register"}
          </Button>
          <Link to={`/view-users`}>
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

export default RegisterUser;
