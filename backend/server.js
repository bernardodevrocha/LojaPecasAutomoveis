require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./Models");

const productRoutes = require("./router/productRoutes");
const userRoutes = require("./router/userRoutes")

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Banco de dados sincronizado.");
  })
  .catch((err) => {
    console.error("❌ Erro ao sincronizar o banco de dados:", err);
    process.exit(1);
  });

app.use("/api/product", productRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
