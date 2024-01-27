import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

import Home from "./components/Home";
import Login from "./components/Login";
import RegisterUser from "./components/RegisterUser";
import RegisterFarmer from "./components/RegisterFarmer";
import UploadFarmers from "./components/UploadFarmers";
import UsersList from "./components/UsersList";
import FarmersList from "./components/FarmersList";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import Logout from "./components/Logout";

const App = () => {

  const ROLES = {
    User: 'user',
    Admin: 'admin',
  };
  
    
  return (
    <>
      <Navbar
        bg="navbar rounded ps-3"
        expand="lg"
        className="justify-content-between s mt-4 ms-5 me-5 mb-5"
      >
        <Navbar.Brand as={Link} to="/" className="text-warning fw-bold fs-3">
          Farmers App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-3 ">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register-user">
              New User
            </Nav.Link>
            <Nav.Link as={Link} to="/view-users">
              Users
            </Nav.Link>
            <Nav.Link as={Link} to="/farmers">
              Farmers
            </Nav.Link>
            <Nav.Link as={Link} to="/register-farmer">
              New Farmer
            </Nav.Link>
            <Nav.Link as={Link} to="/upload-farmers">
              Upload Farmers
            </Nav.Link>
            <Nav.Link as={Link} to="/logout">
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* PROTECTED ROUTESs */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/farmers" element={<FarmersList />} />
          <Route path="/register-farmer" element={<RegisterFarmer />} />
          <Route path="/upload-farmers" element={<UploadFarmers />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="/view-users" element={<UsersList />} />
          <Route path="/edit-user/:userId" element={<RegisterUser />} />
          <Route path="/register-user" element={<RegisterUser />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<NotFound />}>
          {" "}
        </Route>
      </Routes>
    </>
  );
};

export default App;
