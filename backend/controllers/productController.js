const dbMod = require("../Models");
const db = dbMod.default || dbMod;
const { Product } = db;

exports.getAllProducts = async(req, res) => {
  try{
    const products = await Product.findAll();
    res.json(products);
  }catch(err){
    console.error("Erro ao buscar produtos!");
    res.status(500).json({error: "Erro ao buscar produtos do banco de dados, " + err});
  }
}