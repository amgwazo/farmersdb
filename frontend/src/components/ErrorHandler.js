import { handleErrorAlert } from "./SweetAlerts";

export const ErrorHandler = (error) => {

    
       if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 400) {
        // Check if there's a custom error message in the response
        if (error.response.data.message) {
          handleErrorAlert(error.response.data.message);
        } else {
          // No custom message, handle the error generically
          handleErrorAlert("An error occurred while processing your requests");
        }
      } else {
        // Handle other error statuses if needed
        handleErrorAlert(
          "Request failed with status code:",
          error.response.status
        );
        // handleErrorAlert("An error occurred while processing your request");
      }
    } else if (error.request) {
      // The request was made but no response was received
      handleErrorAlert("Request made but no response received:", error.request);
      // handleErrorAlert("An error occurred while processing your request");
    } else {
      // Something happened in setting up the request that triggered an Error
      handleErrorAlert("Error setting up the request:", error.message);
      // handleErrorAlert('An error occurred while processing your request');
    }
  }

