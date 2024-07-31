'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('currencies', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      name: {
        type: Sequelize.ENUM(["btc","usd"]),
        allowNull: false,
        unique: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('currencies');
  }
};
