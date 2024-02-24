const strToNumConverter = (strNum) => {
  // 1. Handle hidden characters and encoding:
  strNum = strNum.trim().replace(/\s/g, ""); // Remove spaces and non-breaking spaces
  // Handle other potential encoding issues based on your input source

  // 2. Convert to number (optional, for calculations):
  const num = Number(strNum); // Attempt to convert to a number for calculations
  if (!isNaN(num)) {
    // Check if conversion was successful
    // Perform calculations or operations using the number value
    console.log('it is a number');

    return num;
  }

  // 3. Remove commas (handles large numbers with BigInt):
  const commaRemovedStr = strNum.replace(/,/g, "");
   if (!isNaN(commaRemovedStr)) {
     // Check if conversion was successful
     // Perform calculations or operations using the number value
     console.log("commaRemovedStr is a number");

     return commaRemovedStr;
   }

  const largeNumber = BigInt(commaRemovedStr); // Handle large numbers safely

  // Use commaRemovedStr or largeNumber based on your needs
  return largeNumber;
};

module.exports = {
  strToNumConverter,
};
