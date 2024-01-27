import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

import Home from "./components/Home";
import Login from "./components/Login";
import RegisterUser from "./components/RegisterUser";
import RegisterFarmer from "./components/RegisterFarmer";
import UploadFarmers from "./components/UploadFarmers";
import UsersList from "./components/UsersList";
import FarmersList from "./components/FarmersList";

const App = () => {

  
  return (
    <Router>
      <Navbar
        bg="navbar rounded ps-3"
        expand="lg"
        className="justify-content-between bg-success mt-4 ms-5 me-5 mb-5"
      >
        <Navbar.Brand href="/" className="text-warning fw-bold fs-3">
          Farmers App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-3">
            <Nav.Link className="navlink-custom text-light" href="/">
              Home
            </Nav.Link>
            <Nav.Link className="navlink-custom text-light" href="/login">
              Login
            </Nav.Link>
            <Nav.Link
              className="navlink-custom text-light"
              href="/register-user"
            >
              New User
            </Nav.Link>
            <Nav.Link className="Navlink-custom text-light" href="/view-users">
              Users
            </Nav.Link>
            <Nav.Link className="navlink-custom text-light" href="/farmers">
              Farmers
            </Nav.Link>
            <Nav.Link
              className="navlink-custom text-light"
              href="/register-farmer"
            >
              New Farmer
            </Nav.Link>
            <Nav.Link
              className="navlink-custom text-light"
              href="/upload-farmers"
            >
              Upload Farmers
            </Nav.Link>
            <Nav.Link className="navlink-custom text-light" href="/logout">
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/register-farmer" element={<RegisterFarmer />} />
        <Route path="/upload-farmers" element={<UploadFarmers />} />
        <Route path="/farmers" element={<FarmersList />} />
        <Route path="/view-users" element={<UsersList />} />
        <Route path="/edit-user/:userId" element={<RegisterUser />} />
      </Routes>
    </Router>
  );
};

export default App;