import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

import Home from "./components/Home";
import Login from "./components/Login";
import RegisterUser from "./components/RegisterUser";
import RegisterFarmer from "./components/RegisterFarmer";
import UploadFarmers from "./components/UploadFarmers";

const App = () => {
  return (
    <Router>
      <Navbar bg="light" expand="lg" className="justify-content-between">
        <Navbar.Brand href="/">Farmers Database</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/register-user">Register User</Nav.Link>
            <Nav.Link href="/register-farmer">Register Farmer</Nav.Link>
            <Nav.Link href="/upload-farmers">Upload Farmers</Nav.Link>
            <Nav.Link href="/logout">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/register-farmer" element={<RegisterFarmer />} />
        <Route path="/upload-farmers" element={<UploadFarmers />} />
      </Routes>
    </Router>
  );
};

export default App;
