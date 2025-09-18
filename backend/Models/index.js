const { Sequelize } = require("sequelize");
const config = require("../config/db.js");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  { host: dbConfig.host, dialect: dbConfig.dialect, logging: false }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./User")(sequelize);
db.Product = require("./Product")(sequelize);
db.Sale = require("./Sale.js")(sequelize);
db.SaleItem = require("./SaleItem.js")(sequelize);

db.User && db.User.hasMany(db.Sale,  { foreignKey:'userId',  as:'sales' });
db.Sale.belongsTo(db.User,           { foreignKey:'userId',  as:'user'  });

db.Sale.hasMany(db.SaleItem,         { foreignKey:'saleId',  as:'items', onDelete:'CASCADE' });
db.SaleItem.belongsTo(db.Sale,       { foreignKey:'saleId',  as:'sale' });

db.Product.hasMany(db.SaleItem,      { foreignKey:'productId', as:'saleItems' });
db.SaleItem.belongsTo(db.Product,    { foreignKey:'productId', as:'product' });

module.exports = db;