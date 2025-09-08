const { User } = require("../Models/User");
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
    
    // Confirme que o usuário não existe
    const existingUser = User.findOne({where: {email}});
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