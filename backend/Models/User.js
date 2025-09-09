const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('Users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role:{
      type: DataTypes.ENUM("admin", "usuario", "funcionario"),
      defaultValue: "usuario",
      allowNull: false
    },
  }, {
    tableName: "Users",
    timestamps: true
  });
  return User;
}