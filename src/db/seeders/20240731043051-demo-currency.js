'use strict';

const { Op } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('currencies', [
      {
        id: 1,
        name: "btc",
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        id: 2,
        name: "usd",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('currencies', {
      id: {[Op.in]: [1, 2]}
    }, {});
  }
};
