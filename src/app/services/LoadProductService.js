
const ProductModel = require("../models/productModel")
const {FormatPrice, date} = require('../../lib/functions')

async function getImages(productId) {
    let files = await ProductModel.files(productId)
     files = files.map(file =>({
         ...file,
         src: `${file.path.replace("public", "")}`
     }))
        return files
 
}

async function format(product){
        const files =  await getImages(product.id)
        product.img = files[0].src.replace(/\\/g, '/')
        product.FormatPrice = FormatPrice(product.price)
        product.FormatOldPrice = FormatPrice(product.old_price)
        product.files = files
        const { day, hour, minutes, mounth} = date(product.updated_at)
        
        product.published = {
            day :`${day}/${mounth}`,
            hour: `${hour}h${minutes}`
        }
        
        return product
}

const LoadService = {
    load(service, filter){
        this.filter = filter
        return this[service]()
    },
   async product(){
        try {
        const product =  await ProductModel.FindOne(this.filter)
        
        return format(product)
        
         } catch (error) {
            console.error(error);
            
        }
    },
    async products(){
        const products = await ProductModel.FindAll(this.filter)
        
        const productsPromise = products.map(format)
        return Promise.all(productsPromise)
    },
    async productsDeleted(){
        try {
            const product =  await ProductModel.FindDeleted(this.filter)
            
            return format(product)
            
             } catch (error) {
                console.error(error);
                
            }
    },
    format,
}

module.exports = LoadService