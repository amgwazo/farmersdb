import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import AuthContext from "../context/AuthProvider";

const UserList = () => {

  
 
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3; // Adjust as needed
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const { auth } = useContext(AuthContext);
    const { token } = auth;
    const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
          // const apiUrl = process.env.REACT_APP_API_URL;
          const response = await axios.get(`/auth/filtered/users`, {
            headers: {
              Authorization: `${token}`, 
            },
          });
         
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);


  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
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

  const filteredUsers = sortedUsers.filter(
        (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);

  }

  
   const handleCreate = () => {
     navigate(`/register-user`);
   };

  return (
    <div className="table-container mt-4 ms-5 me-5">
      <h5 className="text-warning">Users</h5>
      <div className="  d-md-flex justify-content-between">
        <div className="col-sm-12 col-md-7 col-lg-6 col-xl-4 col-xxl-4 ">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3 py-0 w-50 border-dark rounded"
          />
        </div>
        <Button
          variant="outline-success"
          type="button"
          className="btn btn-sm py-1 mb-3 save-button"
          onClick={handleCreate}
        >
          Add New
        </Button>
      </div>
      <table>
        <thead>
          <tr className="ps-5 ms-5">
            <th onClick={() => handleSort("company")}>
              Company
              {sortConfig.key === "company" && (
                <span className="table-sort-arrow ">
                  {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("username")}>
              Username
              {sortConfig.key === "username" && (
                <span className="table-sort-arrow ">
                  {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("role")}>
              Role
              {sortConfig.key === "role" && (
                <span className="table-sort-arrow ">
                  {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                </span>
              )}
            </th>

            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr
              className="ps-5"
              key={index}
              onClick={() => handleEdit(user._id)}
            >
              <td>{user.company}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <Link to={`/edit-user/${user._id}`}>
                  <Button variant="dark" size="sm">
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
        <span className="me-2 fs-6 mt-1 page-number">{`Page ${currentPage} of ${totalPages}`}</span>
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

export default UserList;
