import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { format } from "date-fns";
import { ErrorHandler } from "./ErrorHandler";
import { handleSuccessAlert } from "./SweetAlerts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask"; 

function RegisterFarmer() {
 

  const { auth } = useAuth();
  const { token, userCompany } = auth;

  const { farmerId } = useParams();

  const navigate = useNavigate();

  const [farmerData, setFarmerData] = useState({
    company: userCompany,
    firstName: "",
    lastName: "",
    nationalId: "",
    dob: "",
    gender: "",
    year: "2024",
    loanAmount: 0,
    companyId: "",
    creationDate: "",
    updatedDate: "",
    capturedBy: "",
    lastModifiedBy: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    company: "",
    firstName: "",
    lastName: "",
    nationalId: "",
    dob: "",
    gender: "",
    year: "",
    loanAmount: 0,
    companyId: "",
    creationDate: "",
    updatedDate: "",
    capturedBy: "",
    lastModifiedBy: "",
  });

  useEffect(() => {
    // Check if there's a user ID in the URL
    if (farmerId) {
      // Fetch user details based on the provided user id
      const fetchFarmerDetails = async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const response = await axios.get(
            `${apiUrl}/farmer/filtered/farmer?searchTerm=${farmerId}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          const farmer = response.data;

          setFarmerData({
            company: farmer.company,
            firstName: farmer.firstName,
            lastName: farmer.lastName,
            nationalId: farmer.nationalId,
            dob: farmer.dob,
            //farmer.dob,
            gender: farmer.gender,
            year: farmer.year,
            loanAmount: farmer.loanAmount,
            loanBalance: farmer.loanBalance,
            companyId: farmer.companyId,
            creationDate: format(farmer.creationDate, "MMMM d yyyy, h:mm a"),
            updatedDate: format(farmer.updatedDate, "MMMM d yyyy, h:mm a"),
            capturedBy: farmer.capturedBy,
            lastModifiedBy: farmer.lastModifiedBy,
          });
        } catch (error) {
          ErrorHandler(error);
          // console.error("Error fetching farmer details:", error);
        }
      };

      fetchFarmerDetails();
    } else {
      setFarmerData({ year: "2024", company: userCompany });
    }
  }, [farmerId, token, userCompany]);

  // const dobString = farmerData.dob
  //   ? new Date(farmerData.dob).toISOString().split("T")[0]
  //   : "";

  // const formatDateString = (dateString) => {
  //   const date = new Date(dateString);
  //   const options = { day: "numeric", month: "short", year: "numeric" };
  //   return date.toLocaleDateString("en-GB", options);
  // };

  // const dobString = farmerData.dob ? formatDateString(farmerData.dob) : "";

  const handleChange = (e) => {

     const { name, value } = e.target;

    // Check if the field is 'loanAmount'
    if (name === "loanAmount") {
      // Format the input value with thousand separators
      const formattedValue = value
        .replace(/[^\d.]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // Update the state with the formatted value and clear validation errors
      setFarmerData({ ...farmerData, [name]: formattedValue , loanBalance: formattedValue});
    } else {
      // For other fields, update the state with the unformatted value and clear validation errors
      setFarmerData({ ...farmerData, [name]: value });
    }

    setValidationErrors({ ...validationErrors, [name]: "" });

    // setFarmerData({ ...farmerData, [e.target.name]: e.target.value });
    // setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (
      !farmerData.firstName ||
      !farmerData.lastName ||
      !farmerData.nationalId
    ) {
      setValidationErrors({
        firstName: !farmerData.firstName ? "First name is required" : "",
        lastName: !farmerData.lastName ? "Last name is required" : "",
        nationalId: !farmerData.nationalId ? "National ID is required" : "",
      });
      return;
    }

    // Validate national ID format (000000/00/0)
    const nationalIdRegex = /^\d{6}\/\d{2}\/\d{1}$/;

    if (!nationalIdRegex.test(farmerData.nationalId)) {
      setValidationErrors({
        ...validationErrors,
        nationalId:
          "National ID should be 9 Numbers in the format 000000/00/0 ",
      });
      return;
    }

    //  let response;

    try {
      if (farmerId) {
        // Update user if user ID is present in the URL
        // response = await axios.put(`/farmer?_id=${farmerId}`, farmerData, {
        await axios.put(`/farmer?_id=${farmerId}`, farmerData, {
          headers: {
            Authorization: `${token}`,
          },
        });
      } else {
        // Register new user if no user ID is present
        //  response = await axios.post(`/farmer`, farmerData, {
        await axios.post(`/farmer`, farmerData, {
          headers: {
            Authorization: `${token}`,
          },
        });
      }

      handleSuccessAlert(
        `Farmer ${farmerId ? "Updated" : "Registered"} Successfully.`
      );
      // Redirect to the Users component after registration/update
      navigate("/farmers");
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleDateChange = (date) => {
    // Convert selected date to ISO string format and update state
    setFarmerData({
      ...farmerData,
      dob: date.toISOString(),
    });
  };

  
   function formatNumberWithCommas(number) {
    //  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     if (number == null) return ""; // Return empty string for undefined or null numbers
     console.log(number)
     console.log(number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
     return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

   }

  //  const testNumber = 3500;
  //  console.log(formatNumberWithCommas(testNumber));

  return (
    <div className="container w-75 bg-light p-3 bg-dark  rounded my-1 ps-md-4 pe-md-4">
      <h6 className="my-0 w-100 ms-0 text-warning ps-0 ps-md-5 pe-md-5">
        {farmerId ? "Update Farmer" : "Register Farmer"}
      </h6>
      <Form
        autocomplete="off"
        onSubmit={handleSubmit}
        className="row text-success pt-0 ps-md-5 pe-md-5"
      >
        <Form.Group controlId="formCompany" className="col-md-6">
          <Form.Label>Farmer Company</Form.Label>
          <Form.Control
            as="select"
            name="company"
            value={farmerData.company}
            onChange={handleChange}
            className="ps-1 py-0"
            disabled
          >
            <option value="Farmers Board Of Zambia">
              Farmers Board Of Zambia
            </option>
            <option value="Chilonga Milling">Chilonga Milling</option>
            <option value="Matanda Agro">Matanda Agro</option>
            <option value="Mkhuto Agriculture Services">
              Mkhuto Agriculture Services
            </option>
          </Form.Control>
        </Form.Group>

        <div className="col-xs-0 col-md-3"></div>

        <Form.Group controlId="formYear" className="col-md-3">
          <Form.Label>Harvest Season</Form.Label>
          <Form.Control
            type="text"
            placeholder="Harvest Season"
            name="year"
            value={farmerData.year}
            onChange={handleChange}
            isInvalid={!!validationErrors.year}
            required
            className="ps-1"
            disabled
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.year}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="col-xs-0 col-md-6"></div>

        <Form.Group controlId="formLoanAmount" className="col-md-3">
          <Form.Label>Loan Amount</Form.Label>
          <InputMask
            // mask="9999999999" // Only allows digits
            maskChar=""
            type="text"
            placeholder="Enter Loan Amount"
            name="loanAmount"
            value={formatNumberWithCommas(farmerData.loanAmount)}
            // value={farmerData.loanAmount.toLocaleString(
            //   "en-US",
            //   numberFormatOptions
            // )}
            onChange={handleChange}
            isInvalid={!!validationErrors.loanAmount}
            required
            className="ps-1 py-0"
            disabled={farmerData.loanAmount !== farmerData.loanBalance ? true : false}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.loanAmount}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLoanBalance" className="col-md-3">
          <Form.Label>Loan Balance</Form.Label>
          <div className="ps-1 py-0">{farmerData.loanBalance}</div>
        </Form.Group>

        <Form.Group controlId="formFirstName" className="col-md-6">
          <Form.Label>First name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter FIrst Name"
            name="firstName"
            value={farmerData.firstName}
            onChange={handleChange}
            isInvalid={!!validationErrors.firstName}
            required
            className="ps-1 py-0"
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.firstName}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLastName" className="col-md-6">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Last Name"
            name="lastName"
            value={farmerData.lastName}
            onChange={handleChange}
            isInvalid={!!validationErrors.lastName}
            required
            className="ps-1"
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.lastName}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formNationalId" className="col-md-3">
          <Form.Label>National ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter National ID"
            name="nationalId"
            value={farmerData.nationalId}
            onChange={handleChange}
            isInvalid={!!validationErrors.nationalId}
            required
            className="ps-1"
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.nationalId}
          </Form.Control.Feedback>
        </Form.Group>

        {/* <Form.Group controlId="formdob" className="col-md-3">
          <Form.Label>Date Of Birth</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter date Of Birth"
            name="dob"
            // value="2009-02-18" 
            value={farmerData.dob || ""}
            onChange={handleChange}
            isInvalid={!!validationErrors.dob}
            required
            className="ps-1"
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.dob}
          </Form.Control.Feedback>
        </Form.Group> */}
        <Form.Group controlId="formdob" className="col-md-3">
          <Form.Label>Date Of Birth</Form.Label>
          <DatePicker
            placeholderText="Enter date Of Birth"
            // selected={new Date(farmerData.dob)} // Convert farmerData.dob string to Date object
            selected={farmerData.dob ? new Date(farmerData.dob) : null}
            onChange={(date) => handleDateChange(date)}
            dateFormat="yyyy-MM-dd"
            isInvalid={!!validationErrors.dob}
            required
            className="ps-1"
          />
        </Form.Group>

        <Form.Group controlId="formGender" className="col-md-3">
          <Form.Label>Gender</Form.Label>
          <Form.Control
            as="select"
            name="gender"
            value={farmerData.gender}
            onChange={handleChange}
            className="ps-1"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Form.Control>
        </Form.Group>

        <div className="col-xs-0 col-md-3"></div>

        <Form.Group controlId="formCapturedBy" className="col-md-3">
          <Form.Label>Captured By</Form.Label>
          <Form.Control
            type="text"
            name="capturedBy"
            value={farmerData.capturedBy}
            onChange={handleChange}
            isInvalid={!!validationErrors.capturedBy}
            className="ps-1"
            disabled
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.capturedBy}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formCreationDate" className="col-md-3">
          <Form.Label>creation Date</Form.Label>
          <Form.Control
            type="text"
            name="CreationDate"
            value={farmerData.creationDate}
            onChange={handleChange}
            isInvalid={!!validationErrors.creationDate}
            className="ps-1"
            disabled
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.creationDate}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLastModifiedBy" className="col-md-3">
          <Form.Label>Last Modified By</Form.Label>
          <Form.Control
            type="text"
            name="lastModifiedBy"
            value={farmerData.lastModifiedBy}
            onChange={handleChange}
            isInvalid={!!validationErrors.lastModifiedBy}
            className="ps-1"
            disabled
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.lastModifiedBy}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formUpdatedDate" className="col-md-3">
          <Form.Label>Updated Date</Form.Label>
          <Form.Control
            type="text"
            name="updatedDate"
            value={farmerData.updatedDate}
            onChange={handleChange}
            isInvalid={!!validationErrors.updatedDate}
            className="ps-1"
            disabled
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.updatedDate}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="mt-4">
          <Button
            variant="outline-success"
            type="submit"
            className="me-3 btn btn-sm "
          >
            {farmerId ? "Update" : "Register"}
          </Button>
          <Link to={`/farmers`}>
            <Button
              variant="outline-danger"
              type="button"
              className="me-2 btn btn-sm "
            >
              Cancel
            </Button>
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default RegisterFarmer;
