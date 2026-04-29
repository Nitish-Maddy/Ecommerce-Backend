const Settings = require("../models/settings.model");

const getSettings = async (userId) => {
  try {
    const settings = await Settings.findOne({ userId });
    return settings;
  } catch (error) {
    throw new Error("Unable to fetch settings");
  }
};

const updateSettings = async (userId, data) => {
  try {
    const updatedSettings = await Settings.findOneAndUpdate(
      { userId },
      data,
      { new: true, upsert: true }
    );

    return updatedSettings;
  } catch (error) {
    throw new Error("Unable to update settings");
  }
};

module.exports = {
  getSettings,
  updateSettings
};