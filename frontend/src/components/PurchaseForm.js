import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { handleSuccessAlert } from "./SweetAlerts";
import { useNavigate } from "react-router-dom";

const PurchaseForm = () => {
  const { auth } = useAuth();
  const { token } = auth;
  const navigate = useNavigate();

  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [commodities, setCommodities] = useState([
    { commodityId: "", quantity: "", price: "" },
  ]);
  const [commodityList, setCommodityList] = useState([]);
  const [grossAmount, setGrossAmount] = useState(0);
  const [loanRecovery, setLoanRecovery] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch farmers data when component mounts
    const fetchFarmers = async () => {
      try {
        const response = await axios.get("/farmer", {
          headers: {
            Authorization: `${token}`,
          },
        });
        setFarmers(response.data);
      } catch (err) {
        console.error("Error fetching farmers:", err);
      }
    };

    // Fetch commodity list when component mounts
    const fetchCommodityList = async () => {
      try {
        const response = await axios.get(
          `setup/company/one?searchTerm=${auth?.userCompanyId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        setCommodityList(response.data.allowedCommodities);
      } catch (err) {
        console.error("Error fetching commodities:", err);
      }
    };

    fetchFarmers();
    fetchCommodityList();
  }, [token, auth]);

  useEffect(() => {
    // Calculate Gross Amount
    const total = commodities.reduce((acc, curr) => {
      return acc + parseFloat(curr.quantity) * parseFloat(curr.price);
    }, 0);
    setGrossAmount(total);

    // Calculate Loan Recovery
    const loanBalance = selectedFarmer ? selectedFarmer.loanBalance : 0;
    const recovery = Math.min(total, loanBalance);
    setLoanRecovery(recovery);

    // Calculate Net Amount
    setNetAmount(total - recovery);
  }, [commodities, selectedFarmer]);

  const handleSelectFarmer = (e) => {
    const selectedId = e.target.value;
    const farmer = farmers.find((farmer) => farmer._id === selectedId);
    setSelectedFarmer(farmer);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...commodities];
    list[index][name] = value;

    // If changing commodity, update the price
    if (name === "commodityId") {
      const selectedCommodity = commodityList.find(
        (commodity) => commodity._id === value
      );
      
      list[index].commodityId = value;
      list[index].price = selectedCommodity ? selectedCommodity.price : "";
      list[index].commodity = selectedCommodity ? selectedCommodity.name : "";
       
    }

    setCommodities(list);
  };

  const handleAddCommodity = () => {
    setCommodities([
      ...commodities,
      { commodityId: "", quantity: 0, price: 0 },
    ]);
  };

  const handleRemoveCommodity = (index) => {
    const list = [...commodities];
    list.splice(index, 1);
    setCommodities(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

        console.log("test comm...", commodities)
        
      const response = await axios.post(
        "/farmer/purchase/create",
        {
          farmerId: selectedFarmer._id,
          commodities,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setError("");

      handleSuccessAlert(`Commodity Purchase saved Successfully.`);
      // Redirect to the Users component after registration/update
      navigate("/farmers");
    } catch (err) {
      setError(err.response.data.error);
      setMessage("");
    }
  };

  return (
    <div className="container w-75 bg-light p-3 bg-dark text-success rounded my-1 ps-md-4 pe-md-4">
      <h5 className="mb-4 text-warning">Create New Purchase</h5>
      <form autocomplete="off" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Select Farmer:</label>
            <select className="form-select" onChange={handleSelectFarmer}>
              <option value="">-- Select Farmer --</option>
              {farmers.map((farmer) => (
                <option key={farmer._id} value={farmer._id}>
                  {farmer.nationalId} - {farmer.firstName} {farmer.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedFarmer && (
          <div className="row mb-3">
            <div className="col-md-6">
              <label>First Name:</label>
              <span>{selectedFarmer.firstName}</span>
            </div>
            <div className="col-md-6">
              <label>Last Name:</label>
              <span>{selectedFarmer.lastName}</span>
            </div>
            <div className="col-md-6">
              <label>National ID:</label>
              <span>{selectedFarmer.nationalId}</span>
            </div>
            <div className="col-md-6">
              <label>Loan Amount:</label>
              <span>{selectedFarmer.loanAmount || 0}</span>
            </div>
            <div className="col-md-6">
              <label>Loan Balance:</label>
              <span>{selectedFarmer.loanBalance || 0}</span>
            </div>
            <div className="col-md-6">
              <label>Gross Amount:</label>
              <span>{grossAmount || 0}</span>
            </div>
            <div className="col-md-6">
              <label>Loan Recovery:</label>
              <span>{loanRecovery || 0}</span>
            </div>
            <div className="col-md-6">
              <label>Net Amount:</label>
              <span>{netAmount || 0}</span>
            </div>
          </div>
        )}

        <h3 className="mt-4 mb-3">Commodities</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Commodity</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Line Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {commodities.map((commodity, index) => (
              <tr key={index}>
                <td>
                  <select
                    className="form-select"
                    name="commodityId"
                    value={commodity.commodityId}
                    onChange={(e) => handleInputChange(e, index)}
                  >
                    <option value="">-- Select Commodity --</option>
                    {commodityList.map((commodity) => (
                      <option key={commodity._id} value={commodity._id}>
                        {commodity.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={commodity.quantity}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={commodity.price || 0}
                    readOnly
                  />
                </td>
                <td>
                  {parseFloat(commodity.quantity) *
                    parseFloat(commodity.price) || 0}
                </td>
                <td>
                  {index !== 0 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemoveCommodity(index)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row">
          <div className="col-md-12">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddCommodity}
            >
              Add Commodity
            </button>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </div>
        </div>
      </form>
      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default PurchaseForm;
