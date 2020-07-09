const Cart = require("../../lib/cart")
const LoadProduct = require("../services/LoadProductService")
module.exports = {
    async index(req, res){
     let {cart} = req.session
     
     cart = Cart.init(cart)
      

        return res.render("cart/index", {cart})
    },
    async addOne(req, res){
        //pegar o id do produto e o produto
        const {id} = req.params
        const product = await LoadProduct.load('product', {where: {id}})

        //pegar o carrinho da sessão 
        let {cart} = req.session

        //add o produto no carrinho
        cart = Cart.init(cart).addOne(product)

        //atualizar o carrinho 
        req.session.cart = cart
        
        // redirecionar o usuario
        return res.redirect('/cart')
    },
    removeOne(req, res){
         //pegar o id do produto
         const {id} = req.params
        // pegar carrinho da sessão
        let {cart} = req.session

        //se não tiver carrinho 
        if(!cart) return 
        //iniciar o carrinho
        cart = Cart.init(cart).removeOne(id)
        //atualizar o carrinho, removendo 1 item.
        req.session.cart = cart

        //redirect
        return res.redirect('/cart')

    },
    delete(req,res) {
        //pegar o id do produto
         const {id} = req.params
         // pegar carrinho da sessão
         let {cart} = req.session
 
         //se não tiver carrinho 
         if(!cart) return 
           //iniciar o carrinho
        cart = Cart.init(cart).delete(id)
        //atualizar o carrinho, removendo 1 item.
        req.session.cart = cart

        //redirect
        return res.redirect('/cart')

    },
}