import React, { useState } from "react";
import api from "./api";
import { useTable } from "react-table";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const FarmerRegistration = () => {
  // const [farmerData, setFarmerData] = useState({
  //   firstName: "",
  //   lastName: "",
  //   nationalId: "",
  //   dob: "",
  //   gender: "",
  //   year: "",
  //   companyId: "",
  //   creationDate: "",
  //   capturedBy: "",
  //   lastModifiedBy: "",
  // });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [capturedBy, setCapturedBy] = useState("");
  const [lastModifiedBy, setLastModifiedBy] = useState("");

  const columns = [
    {
      Header: "First Name",
      accessor: "firstName",
    },
    {
      Header: "Last Name",
      accessor: "lastName",
    },
    {
      Header: "National ID",
      accessor: "nationalId",
    },
    {
      Header: "Date of Birth",
      accessor: "dob",
    },
    {
      Header: "Gender",
      accessor: "gender",
    },
    {
      Header: "Year",
      accessor: "year",
    },
    {
      Header: "Company ID",
      accessor: "companyId",
    },
    {
      Header: "Creation Date",
      accessor: "creationDate",
    },
    {
      Header: "Captured By",
      accessor: "capturedBy",
    },
    {
      Header: "Last Modified By",
      accessor: "lastModifiedBy",
    },
  ];

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: [
        firstName,
        lastName,
        nationalId,
        dob,
        gender,
        year,
        companyId,
        creationDate,
        capturedBy,
        lastModifiedBy,
      ],
    });

  const handleSingleFarmerRegistration = async () => {
    try {

      const farmerData = {
        firstName,
        lastName,
        nationalId,
        dob,
        gender,
        year,
        companyId,
        creationDate,
        capturedBy,
        lastModifiedBy,
      };

      const response = await api.post("/farmer/create", farmerData);
      // Handle successful farmer registration, show message, etc.
    } catch (error) {
      console.error("Single farmer registration failed:", error.message);
      // Handle error, show message to the user, etc.
    }
  };

const handleBulkUpload = async (file) => {
  if (!file) {
    console.error("No file selected");
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const result = e.target.result;
    let jsonData;

    if (file.name.endsWith(".csv")) {
      // Parse CSV file using papaparse
      jsonData = Papa.parse(result, { header: true, dynamicTyping: true }).data;
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      // Parse Excel file using xlsx
      const workbook = XLSX.read(result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      jsonData = XLSX.utils.sheet_to_json(sheet, { header: "first" });
    } else {
      console.error("Unsupported file format");
      return;
    }

    try {
      // Call the API with the entire array
      await api.post("/farmer/bulk-create", { data: jsonData });
      // Handle success, show message, etc.
      console.log("Bulk upload successful");
    } catch (error) {
      console.error("Bulk upload failed:", error.message);
      // Handle error, show message to the user, etc.
    }
  };

  reader.readAsBinaryString(file);
};



  return (
    <div>
      <h2>Farmer Registration</h2>

      {/* Your form fields for single farmer registration */}
      <div>
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) =>
            setFirstName(e.target.value)
          }
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) =>
            setLastName( e.target.value)
          }
        />
      </div>
      {/* Repeat similar structure for other fields */}

      <button onClick={handleSingleFarmerRegistration}>Register Farmer</button>

      <h2>Bulk Upload</h2>
      <input
        type="file"
        onChange={(e) => handleBulkUpload(e.target.files[0])}
      />

      {/* Display a simple table */}
      <table {...getTableProps()} style={{ marginTop: "20px" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FarmerRegistration;
