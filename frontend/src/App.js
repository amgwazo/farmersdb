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
import Unauthorized from "./components/UnAuthorized";
import useAuth from "./hooks/useAuth";

const App = () => {

  const ROLES = {
    User: 'user',
    Admin: 'admin',
  };
  
  
  const { auth } = useAuth();
  
    
  return (
    <>
      <Navbar
        bg="navbar rounded ps-3"
        expand="lg"
        className="d-xs-column d-md-flex  justify-content-md-between mt-4 ms-5 me-5 mb-5"
      >
        <Navbar.Brand
          as={Link}
          to="/home"
          className="text-warning fw-bold fs-3 "
        >
          Farmers App
        </Navbar.Brand>
        <div>
          <Navbar.Toggle aria-controls="responsive-navbar-nav " />
          <Navbar.Collapse id="responsive-navbar-nav ">
            <Nav className="me-3 ">
              <Nav.Link as={Link} to="/home">
                Home
              </Nav.Link>

              {!auth?.userData && (
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}

              {/* {auth?.roles === "admin" && (
              <>
                
                <Nav.Link as={Link} to="/view-users">
                  Users
                </Nav.Link>
              </>
            )} */}

              {auth?.userData && (
                <>
                  <Nav.Link as={Link} to="/farmers">
                    Farmers
                  </Nav.Link>

                  <Nav.Link as={Link} to="/upload-farmers">
                    Import
                  </Nav.Link>
                  <Nav.Link as={Link} to="/view-users">
                    Users
                  </Nav.Link>
                  <Nav.Link as={Link} to="/account">
                    Account
                  </Nav.Link>
                  <Nav.Link as={Link} to="/logout">
                    Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>

      <Routes>
        {/* <Route path="/" element={<Layout />} /> */}

        <Route path="/" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="home" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* PROTECTED ROUTESs */}
        <Route
          element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}
        >
          <Route path="/farmers" element={<FarmersList />} />
          <Route path="/register-farmer" element={<RegisterFarmer />} />
          <Route path="/edit-farmer/:farmerId" element={<RegisterFarmer />} />
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
