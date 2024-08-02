'use strict';

const { Op } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('wallets', [
      {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        currency_id: 2,
        balance: 50000
      },{
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        currency_id: 1,
        balance: 0
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('wallets', {
      id: {[Op.in]: [1, 2]}
    }, {});
  }
};
