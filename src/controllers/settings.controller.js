const prisma = require('../utils/prisma');
const { ResponseHandler } = require('../utils/responseHandler');

const updateUserSettings = async (req, res, next) => {
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
        user: {
          connect: {
            id: id,
          },
        },
      },
    });
    if (!updatedUser) {
      return ResponseHandler.error(res, 404, 'Error Updating User Settings');
    }

    return ResponseHandler.success(
      res,
      updatedUser,
      200,
      '2FA enabled successfully'
    );
  } catch (error) {
    next(error);
  }
};

const updateAppSetting = async (req, res, next) => {
  try {
    const { termsOfUse, privacyPolicy } = req.body;
    const exisitingAppSettings = await prisma.appSettings.findFirst();

    const appSettings = await prisma.appSettings.upsert({
      where: {
        id: exisitingAppSettings.id,
      },
      update: {
        termsOfUse,
        privacyPolicy,
      },
      create: {
        termsOfUse,
        privacyPolicy,
      },
    });

    if (!appSettings) {
      return ResponseHandler.error(res, 404, 'Error Updating App Settings');
    }
    ResponseHandler.success(
      res,
      appSettings,
      200,
      'App settings updated successfully'
    );
  } catch (err) {
    next(err);
  }
};

const getAppSettings = async (req, res, next) => {
  try {
    const settings = await prisma.appSettings.findFirst();
    if (!settings) {
      return ResponseHandler.error(res, 404, 'App settings not found');
    }
    ResponseHandler.success(
      res,
      settings,
      200,
      'App settings retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

const addFaq = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
      },
    });
    if (!faq) {
      return ResponseHandler.error(res, 404, 'Error adding FAQ');
    }
    ResponseHandler.success(res, faq, 200, 'FAQ added successfully');
  } catch (error) {
    next(error);
  }
};

const getAllFaqs = async (req, res, next) => {
  try {
    const faqs = await prisma.faq.findMany();
    if (!faqs) {
      return ResponseHandler.error(res, 404, 'FAQs not found');
    }
    ResponseHandler.success(res, faqs, 200, 'FAQs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUserSettings,
  updateAppSetting,
  getAppSettings,
  addFaq,
  getAllFaqs,
};
