import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import excelIcon from "./excel-icon.png";


const FailedUploadFarmers = ({ farmers }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const farmersPerPage = 10; // Adjust as needed
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
      farmer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.nationalId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFarmer = currentPage * farmersPerPage;
  const indexOfFirstFarmer = indexOfLastFarmer - farmersPerPage;
  const currentFarmers = filteredFarmers.slice(
    indexOfFirstFarmer,
    indexOfLastFarmer
  );
  const totalPages = Math.ceil(filteredFarmers.length / farmersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(farmers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Farmers");
    XLSX.writeFile(workbook, "farmers.xlsx");
  };

  const handleCreate = () => {
    navigate(`/register-farmer`);
  };

  return (
    <div className="table-container mt-4 ms-5 me-5">
      <h5 className="text-warning">Failed Farmers</h5>
      <div className="  d-md-flex justify-content-between">
        <div className=" col-sm-12 col-md-7 col-lg-6 col-xl-4 col-xxl-4">
          <input
            type="text"
            placeholder="Search "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3 py-0 w-50 border-dark rounded"
          />
        </div>
        <div className="d-md-flex justify-content-between">
          {/* <Button variant="warning" className="save-button btn btn-sm py-1 " onClick={exportToExcel}>
          Export to Excel
        </Button> */}
          <button className="btn btn-sm py-0 mb-3 me-3 excel-btn" onClick={exportToExcel}>
            <img src={excelIcon} alt="Excel Icon" className="excel-icon" />
            <span className="export-text">Export to Excel</span>
          </button>

          <Button
            variant="success "
            type="button"
            className="btn btn-sm py-1 mb-3 save-button"
            onClick={handleCreate}
          >
            Add New
          </Button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("company")}>
              Company
              {sortConfig.key === "company" && (
                <span className="table-sort-arrow ">
                  {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("firstName")}>
              First Name
              {sortConfig.key === "firstName" && (
                <span className="table-sort-arrow ">
                  {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("lastName")}>
              Last name
              {sortConfig.key === "lastName" && (
                <span className="table-sort-arrow ">
                  {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                </span>
              )}
            </th>

            <th onClick={() => handleSort("nationalId")}>
              National Id
              {sortConfig.key === "nationalId" && (
                <span className="table-sort-arrow ">
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
                <Button disabled variant="dark" size="sm">
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="pagination-btn me-2 border-0 fs-5 py-0 rounded pe-2 ps-2"
        >
          {String.fromCharCode(171)} {/* Double Left Arrow */}
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn me-2 border-0 fs-5 py-0 rounded"
        >
          {String.fromCharCode(9666) /* Left Arrow */}
        </button>
        <span className="pagination-btn me-2 fs-6 mt-1 page-number">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn me-2 border-0 fs-5 py-0 rounded"
        >
          {String.fromCharCode(9656) /* Right Arrow */}
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-btn me-2 border-0 fs-5 py-0 rounded pe-2 ps-2"
        >
          {String.fromCharCode(187)} {/* Double Right Arrow */}
        </button>
      </div>
    </div>
  );
};

export default FailedUploadFarmers;
