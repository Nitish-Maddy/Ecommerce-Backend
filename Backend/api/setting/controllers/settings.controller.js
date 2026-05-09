const settingsService = require("../services/settings.service");

const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const settings = await settingsService.getSettings(userId);

    res.status(200).json({
      success: true,
      data: settings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching settings"
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = req.body;

    const updated = await settingsService.updateSettings(userId, data);

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating settings"
    });
  }
};

module.exports = {
  getSettings,
  updateSettings
};