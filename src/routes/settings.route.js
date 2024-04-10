const express = require('express');
const router = express.Router();
const {
  updateUserSettings,
  getAppSettings,
  updateAppSetting,
  addFaq,
  getAllFaqs,
} = require('../controllers/settings.controller');

router.patch('/settings/:id', updateUserSettings, updateAppSetting);
router.get('/settings', getAppSettings);
router.post('/settings', updateAppSetting);
router.post('/settings/faqs', addFaq);
router.get('/settings/faqs', getAllFaqs);

module.exports = router;
