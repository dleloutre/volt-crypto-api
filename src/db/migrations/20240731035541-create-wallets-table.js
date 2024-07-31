'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('wallets', {
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
      currency_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'currencies',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      balance: Sequelize.DataTypes.FLOAT
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('wallets');
  }
};
