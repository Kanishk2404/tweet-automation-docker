"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("ScheduledTweets", "twitterApiKey", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("ScheduledTweets", "twitterApiSecret", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("ScheduledTweets", "twitterAccessToken", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("ScheduledTweets", "twitterAccessSecret", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("ScheduledTweets", "twitterApiKey", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("ScheduledTweets", "twitterApiSecret", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("ScheduledTweets", "twitterAccessToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("ScheduledTweets", "twitterAccessSecret", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
