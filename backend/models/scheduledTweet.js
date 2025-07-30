const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ScheduledTweet = sequelize.define('ScheduledTweet', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(280),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scheduledTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'posted', 'failed'),
      defaultValue: 'pending',
    },
    twitterApiKey: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    twitterApiSecret: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    twitterAccessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    twitterAccessSecret: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    postedTweetId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return ScheduledTweet;
};
