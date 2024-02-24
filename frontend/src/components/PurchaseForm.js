import React, { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const PurchaseForm = () => {

    
  const { auth } = useAuth();
  const { token, userCompany } = auth;

  const [farmerId, setFarmerId] = useState("");
  const [commodities, setCommodities] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...commodities];
    list[index][name] = value;
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
          farmerId,
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
    <div>
      <h2>Create New Purchase</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Farmer ID:
          <input
            type="text"
            value={farmerId}
            onChange={(e) => setFarmerId(e.target.value)}
          />
        </label>
        {commodities.map((commodity, index) => (
          <div key={index}>
            <label>
              Commodity:
              <input
                type="text"
                name="commodity"
                value={commodity.commodity}
                onChange={(e) => handleInputChange(e, index)}
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={commodity.quantity}
                onChange={(e) => handleInputChange(e, index)}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={commodity.price}
                onChange={(e) => handleInputChange(e, index)}
              />
            </label>
            <button type="button" onClick={() => handleRemoveCommodity(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddCommodity}>
          Add Commodity
        </button>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default PurchaseForm;
