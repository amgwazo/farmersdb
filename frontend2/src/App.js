import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import FarmerRegistration from "./components/FarmerRegistration";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="registerfarmer" element={<FarmerRegistration />} />
        <Route path="/farmerregistration" element={<PrivateRoute />} />
      </Routes>
    </Router>
  );
};

export default App;
