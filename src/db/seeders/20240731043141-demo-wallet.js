'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('wallets', [
      {
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        currency: "USD",
        balance: 50000
      },{
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        currency: "BTC",
        balance: 0
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', {
      user_id: 1
    }, {});
  }
};
