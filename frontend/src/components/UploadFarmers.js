import React, { useRef } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import axios from "../api/axios";
import { handleSuccessAlert } from "./SweetAlerts";
import { ErrorHandler } from "./ErrorHandler";
import { Button } from "react-bootstrap";
import useAuth from "../hooks/useAuth";

function UploadFarmers() {
  const { auth } = useAuth();
  const { token } = auth;
  const fileInputRef = useRef(null);

  const handleBulkUpload = async () => {
    const file = fileInputRef.current.files[0];

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
        jsonData = Papa.parse(result, {
          header: true,
          dynamicTyping: true,
        }).data;
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

      console.log(jsonData);

      try {
        // Call the API with the entire array
        await axios.post(
          "/farmer/farmers",
          { data: jsonData },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        // Handle success, show message, etc.
        handleSuccessAlert("Bulk upload successful");
        console.log("Bulk upload successful");
      } catch (error) {
        ErrorHandler(error);
        console.error("Bulk upload failed:", error.message);
        // Handle error, show message to the user, etc.
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="container m-auto w-50 text-warning">
      <h1>Bulk Farmer Upload!</h1>
      <p>
        Please make sure you have properly formatted your data in CSV or Excel
        before proceeding
      </p>
      <div className="flexGrow">
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleBulkUpload}
        />
        <Button
          variant="outline-success"
          type="button"
          className="py-1 mb-3"
          onClick={() => fileInputRef.current.click()}
        >
          Upload
        </Button>
      </div>
    </div>
  );
}

export default UploadFarmers;
