const prisma = require("../utils/prisma");
const { ResponseHandler } = require("../utils/responseHandler");

const handleConnection = (socket) => {
  console.log("a user connected");

  socket.on("connect-with-userId", (data) => {
    console.log(`User connected with userId: ${data.userId}`);

    const { userId } = data;
    socket.join(userId);

    // Handle chat messages
    handleChatMessages(socket);

    // Handle read receipt
    handleReadReceipt(socket);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};

const handleChatMessages = (socket) => {
  socket.on("chat message", async (data) => {
    try {
      const { userId, message, receiverIds } = JSON.parse(data);

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

      receiverIds.forEach((receiverId, index) => {
        socket.to(receiverId).emit("new-message", savedMessages[index]);
      });

      socket.emit("message-sent", savedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
};

const handleReadReceipt = (socket) => {
  socket.on("read-receipt", async (messageId) => {
    try {
      const updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: { read: true },
      });

      socket.emit("read-receipt-ack", updatedMessage);
    } catch (error) {
      console.error("Error updating read receipt:", error);
    }
  });
};

module.exports = { handleConnection };
