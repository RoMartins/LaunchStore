
const LoadProductsService = require("../services/LoadProductService")
const User = require ('../models/UserModel') 
const Order = require ('../models/order') 

const mailer = require("../../lib/mailer")
const Cart = require("../../lib/cart")
const { FormatPrice, date } = require("../../lib/functions")

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
        //pegar id do comprador
     const {UserId: buyer_id} = req.session
        //pegar pedido
        let orders = await Order.FindAll({where : {buyer_id : buyer_id}})

        const ordersPromise = orders.map(async order =>{
            //detalhe do produto
            order.product = await LoadProductsService.load('product', {where:{ id: order.product_id}})
            //detalhe do comprador
            order.buyer = await  User.Find(buyer_id)
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
        })
       orders =  await Promise.all(ordersPromise)

        return res.render('pedido/index' , {orders})

    },
}