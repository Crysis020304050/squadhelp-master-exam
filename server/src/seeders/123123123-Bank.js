module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Banks', [
      {
        cardNumber: '4564654564564564',
        name: 'SquadHelp',
        expiry: '11/20',
        cvc: '453',
        balance: 0.00,
      },
      {
        cardNumber: '4111111111111111',
        name: 'yriy',
        expiry: '09/29',
        cvc: '043',
        balance: 500000.00,
      },
    ], {});
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('Banks', null, {});
  }

};