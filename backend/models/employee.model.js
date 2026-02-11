module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define("employee", {
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    position: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING
    },
    photo: {
      type: Sequelize.TEXT('long') // Allow large Base64 strings
    }
  });

  return Employee;
};
