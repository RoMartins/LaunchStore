
const Order = require("../models/order")
const {FormatPrice, date} = require('../../lib/functions')
const LoadProductsService = require("../services/LoadProductService")
const User = require ('../models/UserModel') 



async function format(order){
       //detalhe do produto
       order.product = await LoadProductsService.load('product', {where:{ id: order.product_id}})
       //detalhe do comprador
       order.buyer = await  User.FindOne({
        where:{id: order.buyer_id}
    })
       //detalhe do vendedor
       order.seller = await User.FindOne({
           where:{id: order.seller_id}
       })
       //formatação de preço
       order.FormatPrice = FormatPrice(order.price) 
       order.FormatTotal = FormatPrice(order.total)

       //formatação de status
       const status ={
           open:'Aberto',
           sold:'Vendido',
           canceled:'Cancelado'
       }
       order.FormatStatus = status[order.status]
       //formatação de atualizado em..
       const update = date(order.updated_at)
       order.FormatUpdatedAt = `${order.FormatStatus} em ${update.day}/${update.mounth}/${update.year}   às   ${update.hour}h ${update.minutes}`

       return order
}

const LoadService = {
    load(service, filter){
        this.filter = filter
        return this[service]()
    },
   async order(){
        try {
            let order = await Order.FindOne(this.filter)
            return format(order)
        
        
         } catch (error) {
            console.error(error);
            
        }
    },
    async orders(){
        //pegar pedido
        let orders = await Order.FindAll(this.filter)
        
        const ordersPromise = orders.map(format)
        return Promise.all(ordersPromise)
    },
    format,
}

module.exports = LoadService