
const ProductModel = require("../models/productModel")
const LoadProductsService = require("../services/LoadProductService")

module.exports = {
    async index(req, res){
        let products =await ProductModel.FindAll()

        if(!products) return res.send("Produto não encontrado")
    
      
         products = await LoadProductsService.load('products')

        return res.render("home/index", {products})
    },
}