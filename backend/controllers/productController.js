const { Product } = require("../Models/Product");

exports.getAllProducts = async(req, res) => {
  try{
    const products = await Product.findAll();
    res.json(products);
  }catch(err){
    console.error("Erro ao buscar produtos: ", err);
    res.status(500).json({error: "Erro ao buscar produtos do banco de dados, " + err});
  }
}