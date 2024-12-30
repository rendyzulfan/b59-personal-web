'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Projects', [
      {
        title: 'Personal Website',
        content: 'Mudah bikin website!',
        image: 'perkembangan.jpg',
        startDate: new Date(),
        endDate: new Date(),
        technologies: "Next JS",
      },
      {
        title: 'E-Commerce Website',
        content: 'Lancarkan bisnismu!',
        image: 'blog.jpg',
        startDate: new Date(),
        endDate: new Date(),
        technologies: "React JS",
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Projects', null, {});
  }
};
