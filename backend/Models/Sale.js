const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sale = sequelize.define('Sale', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    total: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
  }, {
    tableName: 'Sales',
    timestamps: true,
  });

  return Sale;
};
