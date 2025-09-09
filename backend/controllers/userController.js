const db = require("../Models");
const { User } = db;
const bcrypt = require("bcrypt")

exports.getAllUsers = async (req, res) => {
  try{
    const users = await User.findAll();
    res.json(users);
  }catch(err){
    console.error("Erro ao buscar usuários: ", err);
    res.status(500).json({error: "Erro ao buscar usuários no banco de dados, " + err});
  }
}

exports.registerUser = async(req, res) => {
  try{
    const {name, email, password} = req.body;
  
    const existingUser = await User.findOne({where: {email}});
    if(existingUser){
      return res.status(409).json({error: "E-mail já cadastrado"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({message: "Usuário registrado com sucesso!", user: newUser})

  }catch(err){
    console.error("Erro ao registrar novo usuário: ", err);
    res.status(500).json({error: "Erro interno no servidor!"});
  }
}

exports.loginUser = async(req, res) => {
  try{
    const {email, password} = req.body;

    const user = await User.findOne({where: {email}});
    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!user && !isMatch){
      return res.status(401).json({message: "E-mail ou senha inválidos!"});
    }
    res.status(200).json({message: "Login bem-sucedido!", user: {id: user.id, name: user.name, email: user.email}})
  }catch(err){
    console.error("Falha ao fazer a verificação do usuário: ", err);
    res.status(500).json({message: "Erro interno do sistema!"});
  }
}