
const User = require ('../models/UserModel') 
const Order = require ('../models/order') 
const LoadOrderService = require('../services/OrderService')
const mailer = require("../../lib/mailer")
const Cart = require("../../lib/cart")
const LoadProductsService = require("../services/LoadProductService")


const email = (seller, product,buyer) => `
<h2> Olá ${seller.name} </h2>
<p> Você tem um novo pedido de compra </p>
<p> Produto : ${product.name} </p>
<p> Preço : ${product.FormatPrice} </p>
<p><br/><br/></p>
<p> Nome: ${buyer.name} </p>
<p> Email: ${buyer.email} </p>
<p> Endereço :${buyer.address} </p>
<p> Cep :${buyer.cep} </p>
<p><br/><br/></p>
<p>Entre em contato com o comprador para finalizar a venda!</p>
<p><br/><br/></p>
<p>Atenciosamente, equipe LaunchStore</p>
`


  module.exports = {
    async post(req, res){
        try {
            //pegar os produtos do carrinho
            const cart = Cart.init(req.session.cart)

            const buyer_id = req.session.UserId
            const filterItems = cart.items.filter( item => item.product.user_id != buyer_id )
            // criar o pedido
            const createOrdersPromisse= filterItems.map( async item =>{
                let {product, price: total, quantity} = item
                const {price, id:product_id, user_id: seller_id} = product
                const status = "open"

                const order = await Order.create({
                    seller_id,
                    total,
                    quantity,
                    status,
                    buyer_id,
                    product_id,
                    price
                })

                
                //pegar dados do produto
                product = await LoadProductsService.load('product', {where:{
                    id : product_id
                }})

                //dados do vendedor
                const seller = await User.FindOne({where: {id: seller_id}})

                // dados do comprador
                const buyer = await User.FindOne({where: {id: buyer_id}})

            //enviar email com dados da compra para o vendedor
            await mailer.sendMail({
                to: seller.email,
                from:' no-reply@launchstore.com.br ',
                subject: 'Novo pedido de compra',
                html: email(seller, product, buyer),
            })
            return order
        })
        await Promise.all(createOrdersPromisse)

        //limpa o carrinho 
        delete req.session.cart
            Cart.init()

            // notificar o usúario com alguma mensagem
            return res.render('pedido/success')
        } catch (error) {
            
            console.error(error);
            return res.render('pedido/error')
            
            
        }
    },
    async index(req,res){

       const orders = await LoadOrderService.load('orders',{where: {buyer_id: req.session.UserId}})

        return res.render('pedido/index' , {orders})

    },
    async sales(req,res){

        const sales = await LoadOrderService.load('orders',{where: {seller_id: req.session.UserId}})
 
         return res.render('pedido/sales' , {sales})
 
     },
    async show (req, res) {
        let order = await LoadOrderService.load('order',{where: {id: req.params.id}
    })
        return res.render("pedido/details" , {order})
    }
}