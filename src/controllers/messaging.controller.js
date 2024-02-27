const prisma = require("../utils/prisma");
const { ResponseHandler } = require("../utils/responseHandler");

const handleConnection = (socket) => {
  console.log("a user connected");

  socket.on("connect-with-userId", (data) => {
    console.log(`User connected with userId: ${data}`);

    // Join a room using userId as the room name

    const { userId } = data;
    socket.join(userId);

    socket.on("chat message", async (data) => {
      try {
        // Assuming data includes senderId, message, and receiverIds (list of user IDs)
        const { userId, message, receiverIds } = JSON.parse(data);
        console.log(receiverIds);
        console.log(data);

        // Save the message to the database for each receiver
        const savedMessages = await Promise.all(
          receiverIds.map(async (receiverId) => {
            const savedMessage = await prisma.message.create({
              data: {
                senderId: userId,
                message,
                receiver: { connect: { id: receiverId } },
              },
            });
            return savedMessage;
          })
        );

        // Emit the message to each receiver's room
        receiverIds.forEach((receiverId, index) => {
          socket.to(receiverId).emit("new-message", savedMessages[index]);
        });

        // Acknowledge that the message has been received
        socket.emit("message-sent", savedMessages);
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle error and emit an error event if needed
      }
    });

    // Handle read receipt
    socket.on("read-receipt", async (messageId) => {
      try {
        // Update the message's read status in the database
        const updatedMessage = await prisma.message.update({
          where: { id: messageId },
          data: { read: true },
        });

        // Emit an event to acknowledge the read receipt
        socket.emit("read-receipt-ack", updatedMessage);
      } catch (error) {
        console.error("Error updating read receipt:", error);
        // Handle error and emit an error event if needed
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};

module.exports = { handleConnection };
