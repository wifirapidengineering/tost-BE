const prisma = require("../utils/prisma");
const { ResponseHandler } = require("../utils/responseHandler");

const enable2FA = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { darkMode, twoFactorAuth } = req.body;

    const updatedUser = await prisma.userSettings.upsert({
      where: {
        userId: id,
      },
      update: {
        twoFactorAuth,
        darkMode,
      },
      create: {
        twoFactorAuth,
        darkMode,
      },
    });
    if (!updatedUser) {
      return ResponseHandler.error(res, 404, "Error Updating User Settings");
    }

    return ResponseHandler.success(
      res,
      200,
      "2FA enabled successfully",
      updatedUser
    );
  } catch (error) {
    next(error);
  }
};
