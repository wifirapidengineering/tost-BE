const io = require("../../index");
const { handleConnection } = require("../controllers/messaging.controller.js");

function configureSocket(io) {
  io.on("connection", (socket) => {
    handleConnection(socket);
  });
}

module.exports = { configureSocket };
