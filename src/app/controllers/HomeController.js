
const LoadProductsService = require("../services/LoadProductService")

module.exports = {
    async index(req, res){
      const  products = await LoadProductsService.load('products')

        if(!products) return res.send("Produto não encontrado")
    
      

        return res.render("home/index", {products})
    },
}