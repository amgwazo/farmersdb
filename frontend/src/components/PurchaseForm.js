import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const PurchaseForm = () => {
  const { auth } = useAuth();
  const { token } = auth;

  //const { token, userCompany } = auth;
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [commodities, setCommodities] = useState([
    { commodity: "", quantity: "", price: "" },
  ]);
  const [commodityList, setCommodityList] = useState([]);
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
        console.log(response.data.allowedCommodities)
        setCommodityList(response.data.allowedCommodities);
      } catch (err) {
        console.error("Error fetching commodities:", err);
      }
    };

    fetchFarmers();
    fetchCommodityList();
  }, [token, auth]);

  const handleSelectFarmer = (e) => {
    const selectedId = e.target.value;
    const farmer = farmers.find((farmer) => farmer._id === selectedId);
    setSelectedFarmer(farmer);
  };

//   const handleInputChange = (e, index) => {
//     const { name, value } = e.target;
//     const list = [...commodities];
//     list[index][name] = value;
//     setCommodities(list);
//   };

const handleInputChange = (e, index) => {
  const { name, value } = e.target;
  const list = [...commodities];
  const selectedCommodity = commodityList.find(
    (commodity) => commodity._id === value
  );
  list[index][name] = value; // Update the commodity _id
  list[index].price = selectedCommodity ? selectedCommodity.price : ""; // Update the commodity price
  setCommodities(list);
};


  const handleAddCommodity = () => {
    setCommodities([
      ...commodities,
      { commodity: "", quantity: "", price: "" },
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
    } catch (err) {
      setError(err.response.data.error);
      setMessage("");
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Create New Purchase</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-12">
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
              <span>{selectedFarmer.loanAmount}</span>
            </div>
            <div className="col-md-6">
              <label>Loan Balance:</label>
              <span>{selectedFarmer.loanBalance}</span>
            </div>
          </div>
        )}
        <div className="row mb-3">
          <div className="col-md-12">
            <h3>Commodities</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Commodity</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {commodities.map((commodity, index) => (
                  <tr key={index}>
                    <td>
                      <select
                        className="form-select"
                        name="commodity"
                        value={commodity._id}  
                        onChange={(e) => handleInputChange(e, index)}
                      >
                        <option value="">-- Select Commodity --</option>
                        {commodityList.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
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
                        value={commodity.price}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleRemoveCommodity(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row mb-3">
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
        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
      {message && <p className="text-success mt-3">{message}</p>}
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
};

export default PurchaseForm;