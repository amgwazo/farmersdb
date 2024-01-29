import Swal from "sweetalert2";

export const handleSuccessAlert = (message) => {
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
    confirmButtonText: "OK",
  });
};

export const handleErrorAlert = (message) => {
  Swal.fire({
    icon: "error",
    title: "Error!",
    text: message,
    confirmButtonText: "OK",
  });
};

export const handleConfirmationAlert = (message, callback) => {
  Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: message,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};
