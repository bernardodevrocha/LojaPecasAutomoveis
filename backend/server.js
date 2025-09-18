const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./Models");
const productRoutes = require("./router/productRoutes");
const userRoutes = require("./router/userRoutes");
const vendasRoutes = require("./router/vendasRoutes")
const salesRoutes = require("./router/salesRoutes")

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Banco de dados sincronizado.");
}).catch(err => {
  console.error("❌ Erro ao sincronizar o banco de dados:", err);
  process.exit(1);
});

app.use("/api/vendas", vendasRoutes);
app.use("/api/product", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api", (_req, res) => res.status(404).json({ error: "Rota não encontrada." }));
app.use("/api/sales", salesRoutes)

app.listen(port, () => console.log(`🚀 Servidor rodando na porta ${port}`));
