'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Records', 'deleted_at', {
      type: Sequelize.STRING,
      defaultValue: '0'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Records', 'deleted_at');
  }
};
