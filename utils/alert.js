const swal = require('sweetalert2');

function sendAlert(message) {
    Swal.fire({
        title: "Ooops!",
        text: message,
        icon: "error",
      });
}

module.exports = {
    sendAlert,
};