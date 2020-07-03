const {FormatPrice} = require('../../lib/functions')

const LoadProductsService = require("../services/LoadProductService")
const Category = require("../models/Category")
const ProductModel = require("../models/productModel")
const File = require("../models/FileModel")
const { product } = require('../services/LoadProductService')

module.exports = {
    async index(req, res){
      
        
        let {filter, category} = req.query
        
        if(!filter || filter.toLowerCase()== 'toda a loja')  filter = null
    
        let products = await ProductModel.search(filter, category)

        const productsPromise = products.map(LoadProductsService.format)

         products = await Promise.all(productsPromise)

        const search = {
            term: filter || 'Toda a loja',
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