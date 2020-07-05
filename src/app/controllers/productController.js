const fs = require('fs')

const Category = require("../models/Category")
const ProductModel = require("../models/productModel")

const File = require("../models/FileModel")
const LoadProductsService = require("../services/LoadProductService")


module.exports = {

async create(req, res){

    try{
        const categories = await Category.FindAll()

        return res.render("products/create.njk", {categories})
    }catch(error){
        console.error(error);
        
    }
},

async show(req, res){

    const product =  await LoadProductsService.load('product',{where: {id:req.params.id}})

    if(!product) return res.render("products/show",{
        error:"Produto não encontrado"})
    


    return res.render("products/show", {product} )
},

async post(req, res){

    try {
       
        let {category_id, name, description, old_price,price,quantity, status} = req.body

        price = price.replace(/\D/g,"")

        const productId = await ProductModel.create({
            category_id,
            name,
            user_id : req.session.UserId,
            description, 
            old_price: old_price || price,
            price,
            quantity,
            status : status || 1
        })

        
        const filesPromise = req.files.map(file => File.create({
           name:file.filename,
           path:file.path,
           product_id:productId }))
           await Promise.all(filesPromise)
    
        return res.redirect(`/products/${productId}`)
    
    } catch (error) {
        console.log(error)
    }

   
},

    async edit(req, res) {
        const product =  await LoadProductsService.load('product',{where: {id:req.params.id}})

    if(!product) return res.render("products/show",{
        error:"Produto não encontrado"})

        const categories = await Category.FindAll()


        return res.render(`products/edit.njk` , {product, categories})
},

async put(req,res) {

    try {
    
        if(req.files.length != 0) {
            const newFilePromise = req.files.map(file => 
                File.create({ 
                    name:file.filename,
                    path:file.path, 
                    product_id: req.body.id}))
    
                await Promise.all(newFilePromise)
        }
        
    if(req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",") // [1,2,3,]
        const lastIndex = removedFiles.length - 1 
        removedFiles.splice(lastIndex,1) //[1,2,3]

        const removedFilesPromise = removedFiles.map(id => File.delete(id))

        await Promise.all(removedFilesPromise)
    }

    req.body.price = req.body.price.replace(/\D/g,"")
    if(req.body.old_price != req.body.price) {
        const OldProduct = await ProductModel.Find(req.body.id)

        req.body.old_price = OldProduct.price
    } 

    let {category_id, name, description, old_price,price,quantity, status} = req.body

    await ProductModel.update(req.body.id, {
        category_id,
        name,
        description, 
        old_price,
        price,
        quantity,
        status
    })

    return res.redirect(`products/${req.body.id}`)
        
} catch (error) {
    console.error(error);
           
}
  
    },

async delete(req,res){

    const files = await ProductModel.files(req.body.id)
  
    await ProductModel.delete(req.body.id)

    files.map(file =>{
        try {
                fs.unlinkSync(file.path)
        } catch (error) {
            console.error(error);
            
        }
    })
    

    return res.redirect('/products/create')
}    
};
