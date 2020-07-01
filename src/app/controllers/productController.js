const Category = require("../models/Category")
const ProductModel = require("../models/productModel")
const File = require("../models/FileModel")
const {FormatPrice, date} =  require("../../lib/functions")



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

    const product =  await ProductModel.Find(req.params.id)

    if(!product) return res.send("Produto não encontrado")
    
    const { day, hour, minutes, mounth} = date(product.updated_at)

    product.published = {
        day :`${day}/${mounth}`,
        hour: `${hour}h${minutes}`
    }

    product.oldPrice = FormatPrice(product.old_price)
    product.price = FormatPrice(product.price)

    let files = await ProductModel.files(product.id)
     files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    return res.render("products/show", {product, files})
},

async post(req, res){

    try {
        const keys = Object.keys(req.body)
        for(key of keys){
            if(req.body[key] == "") return res.send("Preencha todos os campos")
        }
            
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

        let product_id = productId.rows[0].id
        if(req.files.length == 0)
            return res.send("envie ao menos uma foto")
            
        const filesPromise = req.files.map(file => File.create({
           name:file.filename,
           path:file.path,
           product_id }))
           await Promise.all(filesPromise)
    
        return res.redirect(`/products/${product_id}`)
    
    } catch (error) {
        console.log(error)
    }

   
},

    async edit(req, res) {
        const product = await ProductModel.Find(req.params.id)
    
        if(!product) return res.send("Product not found")

        product.price = FormatPrice(product.price)
        product.oldprice = FormatPrice(product.old_price)

        const categories = await Category.FindAll()

        //get images
        let files = await ProductModel.files(product.id)
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render(`products/edit.njk` , {product, categories, files})
},

async put(req,res) {

    try {
    
    const keys = Object.keys(req.body)
    for(key of keys){
        if(req.body[key] == "" && key!= "removed_files") return res.send("Preencha todos os campos")
    }

        
    if(req.files.length != 0) {
        const newFilePromise = req.files.map(file => 
            File.create({...file, product_id: req.body.id}))

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
    await ProductModel.delete(req.body.id)

    return res.redirect('/products/create')
}    
};
