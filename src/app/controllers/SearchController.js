const {FormatPrice} = require('../../lib/functions')

const Category = require("../models/Category")
const ProductModel = require("../models/productModel")
const File = require("../models/FileModel")

module.exports = {
    async index(req, res){
      
        let results,
            params = {}
        
        const {filter, category} = req.query
        
        if(!filter) return res.redirect("/")
        
        params.filter = filter

        if(category) {
            params.category = category
        }

        let products = await ProductModel.search(params)

        async function getImage(product) {
            let files = await ProductModel.files(product.id)
            files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
            
           const File = files[0].replace(/\\/g, '/')
            return File
        }

        const productsPromise = products.map( async product => {
            product.img = await getImage(product)
            product.price = FormatPrice(product.price)
            product.oldPrice = FormatPrice(product.old_price)
            
            return product
        })

         products = await Promise.all(productsPromise)

        const search = {
            term: req.query.filter,
            total : products.length
        }

        const categories = products.map(product => ({
            CategoryId : product.category_id,
            name : product.category_name
        })).reduce((categoriesFilter, product) => {

            const found = categoriesFilter.some(cat => cat.CategoryId == product.CategoryId)
            if(!found) categoriesFilter.push(product)
            return categoriesFilter
        },[])

        return res.render("search/index", {products , search, categories})
    },
}