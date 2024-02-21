 const removeCommasSafely = (strNum) => {
  // 1. Handle hidden characters and encoding:
  strNum = strNum.trim().replace(/\s/g, ""); // Remove spaces and non-breaking spaces
  // Handle other potential encoding issues based on your input source

  // 2. Convert to number (optional, for calculations):
  const num = Number(strNum); // Attempt to convert to a number for calculations
  if (!isNaN(num)) {
    // Check if conversion was successful
    // Perform calculations or operations using the number value
  }

  // 3. Remove commas (handles large numbers with BigInt):
  const commaRemovedStr = strNum.replace(/,/g, "");
  const largeNumber = BigInt(commaRemovedStr); // Handle large numbers safely

  // Use commaRemovedStr or largeNumber based on your needs
  return largeNumber;
}

// // Example usage:
// const num1 = "  1,234,567  ";
// const num2 = "73,500"; // Might be a very large number

// const result1 = removeCommasSafely(num1);
// const result2 = removeCommasSafely(num2);

// console.log(result1); // Output: 1234567
// console.log(result2); // Output: 73500 (or BigInt value if very large)


module.exports = {
    removeCommasSafely,
}