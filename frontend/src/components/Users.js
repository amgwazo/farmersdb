import React, { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

   const token =
     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWNkMDA0N2M4ZWZmNjU1MDZhOGQ3MiIsInVzZXJuYW1lIjoiYW1vcyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNjEwMzMwNSwiZXhwIjoxNzA2NDYzMzA1fQ.LFCoTgIS_uQ-kVrQqbs62wZr8m8Ep3A-Hvkz-Hw_tJI";

  useEffect(() => {
    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/auth/filtered/users`, {
          headers: {
            Authorization: `${token}`, // Include your access token here
          },
        }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Users</h2>
      <Form.Group controlId="formSearch">
        <Form.Control
          type="text"
          placeholder="Search by Company, User Name or User Role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Company</th>
            <th>Username</th>
            <th>Role</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers
            .filter((user) => {
              const searchRegex = new RegExp(searchTerm, "i");
              return (
                searchRegex.test(user.username) || searchRegex.test(user.role) || searchRegex.test(user.company)
              );
            })
            .map((user) => (
              <tr key={user._id}>
                <td>{user.company}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <Link to={`/edit-user/${user._id}`}>
                    <Button variant="info" size="sm">
                      Edit
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Pagination
        usersPerPage={usersPerPage}
        totalUsers={users.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

const Pagination = ({ usersPerPage, totalUsers, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className={currentPage === number ? "active" : ""}>
            <span onClick={() => paginate(number)}>{number}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Users;
