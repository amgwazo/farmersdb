import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import axios from "../api/axios";
import { handleSuccessAlert } from "./SweetAlerts";
import { ErrorHandler } from "./ErrorHandler";
import { Button, Form } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import FailedUploadFarmers from "./FailedUploadFarmers";

function UploadFarmers() {
  const [failedFarmers, setFailedFarmers] = useState([]);
  
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

       
      // console.log(jsonData);

      try {
        // Call the API with the entire array
             await axios.post("/farmer/farmers", jsonData ,
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
        // console.log('failedFarmers...');

        if(error.response.data.failedFarmers){
         
         const failedFarmersArray = Object.values(
           error.response.data.failedFarmers
         );
         setFailedFarmers(failedFarmersArray);
         console.log(typeof failedFarmersArray)

        }
        
        // console.error("Bulk upload failed:", error.message);

        // Handle error, show message to the user, etc.
      }
    };

    reader.readAsBinaryString(file);


  };

  return (
    <>
      {failedFarmers.length > 0 && (
        <FailedUploadFarmers farmers={failedFarmers}></FailedUploadFarmers>
      )}

      {failedFarmers.length === 0 && (
        <>
          {/* <div className="container m-auto w-50 text-light">
            <h1>Bulk Farmer Upload! </h1>
          </div> */}

          <div className="container   bg-dark p-3  rounded my-1">
            <h3 className="my-0 w-100 ps-2 ms-2 text-warning">
              {"Farmer Upload"}
            </h3>

            <Form onSubmit="" className=" pt-3">
              <p>
                Please make sure you have properly formatted your data in CSV or
                Excel before clicking on the Upload Button below. </p> 
                <p>Your file should look like the table below, please note the Quotes around dob (Date of Birth).
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
            </Form>
          </div>

          <div className="table-container mt-4 ms-5 me-5">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>firstName</th>
                  <th>Last name</th>

                  <th>nationalId</th>

                  <th>dob</th>
                  <th>gender</th>
                  <th>year</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sample Company Name</td>
                  <td>Joseph</td>
                  <td>Banda</td>
                  <td>111111/11/1</td>
                  <td>"2010-01-30"</td>
                  <td>male</td>
                  <td>2024</td>
                </tr>

                <tr>
                  <td>Sample Company Name</td>
                  <td>Mary</td>
                  <td>Phiri</td>
                  <td>111112/11/1</td>
                  <td>"2010-01-30"</td>
                  <td>female</td>
                  <td>2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

export default UploadFarmers;
