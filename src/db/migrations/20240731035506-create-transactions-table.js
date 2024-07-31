'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('transactions', {
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
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      amount: Sequelize.DataTypes.FLOAT,
      price: Sequelize.DataTypes.FLOAT,
      type: Sequelize.DataTypes.ENUM(["BUY","SELL"])
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('transactions');
  }
};
