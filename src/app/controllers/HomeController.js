const {FormatPrice} = require('../../lib/functions')

const Category = require("../models/Category")
const ProductModel = require("../models/productModel")
const File = require("../models/FileModel")

module.exports = {
    async index(req, res){
        const products =await ProductModel.FindAll()

        if(!products) return res.send("Produto não encontrado")
    
        async function getImage(product) {
            let files = await ProductModel.files(product.id)
             files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
            
           const File = files[0].replace(/\\/g, '/')
            return File
        }

        const productsPromise = products.map(async product => {
            product.img = await getImage(product)
            product.price = FormatPrice(product.price)
            product.oldPrice = FormatPrice(product.old_price)
            
            return product
        })
        const lastAdded = await Promise.all(productsPromise)

        return res.render("home/index", {products : lastAdded})
    },
}