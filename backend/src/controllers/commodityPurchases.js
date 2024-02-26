
const CommodityPurchases = require("../models/FarmerPurchases");
const Farmer = require("../models/Farmer");
const Company = require("../models/Company");

const createPurchase = async (req, res) => {
  const { farmerId, commodities } = req.body;

  commodities.forEach((commodity) => {
    console.log(commodity);
  });

  
      const capturedBy = req.user.username;

      const currentDate = new Date();
      currentDate.setUTCHours(currentDate.getUTCHours() + 2);

  try {
    // Retrieve farmer details from the model
    const farmer = await Farmer.findOne({ _id: farmerId });

    // Retrieve the allowed commodities and their prices from the company model

    let allowedCommodities;

    const company = await Company.findOne({ _id: req.user.companyId });
    if (company) {
      allowedCommodities = company.allowedCommodities;
    } else {
      return res.status(400).json({ error: "Company not found" });
    }
    

    // Retrieve all previous transactions for the given farmerId
    const prevPurchases = await CommodityPurchases.find({ farmerId });
    

    const loanRecoveries = prevPurchases.map(
      (purchase) => purchase.recoveredAmount
    );


    // Calculate the total loan recoveries
    const totalLoanRecoveries = loanRecoveries.reduce(
      (total, recovery) => total + recovery,
      0
    );

    

    // Validate if the company is allowed to buy the commodities
    const invalidCommodities = commodities.filter((commodity) => {
      // Check if the commodity name exists in allowedCommodities
      return !allowedCommodities.some(
        (allowedCommodity) => allowedCommodity.name === commodity.commodity
      );
    });

    if (invalidCommodities.length > 0) {
      return res.status(400).json({
        error: "Company is not allowed to buy these commodities",
        invalidCommodities,
      });
    }

    // Calculate the gross amount and loan balance
    let grossAmount = 0;
    const farmerLoan = farmer.loanAmount ? farmer.loanAmount : 0;
    let loanBalance = farmerLoan - totalLoanRecoveries;
    
   const commodityValues = [];
   
    // Calculate the net payment for each commodity based on the loan balance and quantity
    commodities.forEach((commodity) => {
      const allowedCommodity = allowedCommodities.find(
        (allowedCommodity) => allowedCommodity.name === commodity.commodity
      );
      const {name, price } = allowedCommodity;
      const {quantity, _id, commodityId } = commodity;
      const commodityNetPayment = price * quantity;

      commodityValues.push({ commodityId, commodity: name, quantity, price})

      grossAmount += commodityNetPayment;
    });



    // Calculate the net payment
    const netPayment = Math.max(0, grossAmount - loanBalance);
    const currentRecovery =  Math.max(0, grossAmount - netPayment);

    const newPurchase = new CommodityPurchases({
      farmerId,
      commodities: commodityValues,
      grossAmount: grossAmount,
      recoveredAmount: currentRecovery,
      netAmount: netPayment,
      companyId: req.user.companyId,
      capturedBy,
      lastModifiedBy: capturedBy,
      creationDate: currentDate.getTime(),
      updatedDate: currentDate.getTime(),
    });


    await newPurchase.save();

    // Update the loan balance in the model
    farmer.loanBalance = Math.max(
      0,
      loanBalance - currentRecovery
    );
    await farmer.save();

    // Return the net payment to the farmer
    //   return res.json({ netPayment });
    res
      .status(201)
      .json({ message: "Commodity Purchase created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", error });
  }
};


module.exports = {
    createPurchase,
}
