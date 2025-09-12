// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./Models");
const productRoutes = require("./router/productRoutes");
const userRoutes = require("./router/userRoutes");

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

// ✅ API somente em /api/*
app.use("/api/product", productRoutes);
app.use("/api/users", userRoutes);

// (opcional – servir build do Vue em produção)
// const dist = path.join(__dirname, "../frontend/dist");
// app.use(express.static(dist));
// app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));

// 404 só para caminhos de API desconhecidos
app.use("/api", (_req, res) => res.status(404).json({ error: "Rota não encontrada." }));

app.listen(port, () => console.log(`🚀 Servidor rodando na porta ${port}`));
