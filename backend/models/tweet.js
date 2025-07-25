const {DataTypes} =  require('sequelize');

module.exports = (sequelize) => {
    const Tweet =  sequelize.define('Tweet', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING(280),
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING, 
            allowNull: true
        },
        twitterId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
    return Tweet;
}