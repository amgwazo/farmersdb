import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";

const FarmersList = () => {
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const farmersPerPage = 5; // Adjust as needed
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWNkMDA0N2M4ZWZmNjU1MDZhOGQ3MiIsInVzZXJuYW1lIjoiYW1vcyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNjEwMzMwNSwiZXhwIjoxNzA2NDYzMzA1fQ.LFCoTgIS_uQ-kVrQqbs62wZr8m8Ep3A-Hvkz-Hw_tJI";

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/Farmer`, {
          headers: {
            Authorization: `${token}`, // Include your access token here
          },
        });
        setFarmers(response.data);
      } catch (error) {
        console.error("Error fetching Farmers:", error);
      }
    };

    fetchFarmers();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedFarmers = [...farmers].sort((a, b) => {
    if (sortConfig.key && sortConfig.direction === "asc") {
      return a[sortConfig.key].toLowerCase() > b[sortConfig.key].toLowerCase()
        ? 1
        : -1;
    }
    if (sortConfig.key && sortConfig.direction === "desc") {
      return a[sortConfig.key].toLowerCase() < b[sortConfig.key].toLowerCase()
        ? 1
        : -1;
    }
    return 0;
  });

  const filteredFarmers = sortedFarmers.filter(
    (farmer) =>
      farmer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.nationalId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFarmer = currentPage * farmersPerPage;
  const indexOfFirstFarmer = indexOfLastFarmer - farmersPerPage;
  const currentFarmers = filteredFarmers.slice(indexOfFirstFarmer, indexOfLastFarmer);
  const totalPages = Math.ceil(filteredFarmers.length / farmersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="table-container mt-4 ms-5 me-5">
      <input
        type="text"
        placeholder="Search by Company, first Name or last Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-50 mb-3"
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("company")}>
              Company
              {sortConfig.key === "company" && (
                <span style={{ color: "orange" }}>
                  {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("firstName")}>
              First Name
              {sortConfig.key === "firstName" && (
                <span style={{ color: "orange" }}>
                  {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("lastName")}>
              Last name
              {sortConfig.key === "lastName" && (
                <span style={{ color: "orange" }}>
                  {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                </span>
              )}
            </th>

            <th onClick={() => handleSort("nationalId")}>
              National Id
              {sortConfig.key === "nationalId" && (
                <span style={{ color: "orange" }}>
                  {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                </span>
              )}
            </th>

            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {currentFarmers.map((farmer, index) => (
            <tr key={index}>
              <td>{farmer.company}</td>
              <td>{farmer.firstName}</td>
              <td>{farmer.lastName}</td>
              <td>{farmer.nationalId}</td>
              <td>
                <Link to={`/edit-farmer/${farmer._id}`}>
                  <Button variant="light" size="sm">
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="me-2 border-0 fs-5 py-0 rounded pe-2 ps-2"
        >
          {String.fromCharCode(171)} {/* Double Left Arrow */}
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="me-2 border-0 fs-5 py-0 rounded"
        >
          {String.fromCharCode(9666) /* Left Arrow */}
        </button>
        <span className="me-2 fs-6 mt-1">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="me-2 border-0 fs-5 py-0 rounded"
        >
          {String.fromCharCode(9656) /* Right Arrow */}
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="me-2 border-0 fs-5 py-0 rounded pe-2 ps-2"
        >
          {String.fromCharCode(187)} {/* Double Right Arrow */}
        </button>
      </div>
    </div>
  );
};

export default FarmersList;
