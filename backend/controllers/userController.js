const db = require("../Models");
const { User } = db;
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    return res.status(500).json({ error: "Erro ao buscar usuários no banco de dados." });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    const rawPassword = req.body.password ?? req.body.password_hash; // aceita ambos

    if (!name || !email || !rawPassword) {
      return res.status(400).json({ error: "name, email e password são obrigatórios." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "E-mail já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
    });

    return res.status(201).json({
      message: "Usuário registrado com sucesso!",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("Erro ao registrar novo usuário: ", err);
    return res.status(500).json({ error: "Erro interno no servidor!" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email e password são obrigatórios." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "E-mail ou senha inválidos!" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "E-mail ou senha inválidos!" });
    }

    return res.status(200).json({
      message: "Login bem-sucedido!",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Falha ao fazer a verificação do usuário: ", err);
    return res.status(500).json({ message: "Erro interno do sistema!" });
  }
};
