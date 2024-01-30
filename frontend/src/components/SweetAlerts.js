import Swal from "sweetalert2";

export const handleSuccessAlert = (message) => {
  Swal.fire({
    icon: "success",
    // title: "Success!",
    text: message,
    confirmButtonText: "OK",
    customClass: {
      popup: "my-custom-alert",
    },
  });
};

export const handleErrorAlert = (message) => {
  Swal.fire({
    icon: "error",
    // title: "Error!",
    text: message,
    confirmButtonText: "OK",
    customClass: {
      popup: "my-custom-alert",
    },
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
    customClass: {
      popup: "my-custom-alert",
      icon: "my-custom-icon",
      title: "my-custom-title",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};
