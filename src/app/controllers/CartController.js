const Cart = require("../../lib/cart")
const LoadProduct = require("../services/LoadProductService")
module.exports = {
    async index(req, res){
     let {cart} = req.session
    const product = await LoadProduct.load('product', {where: {id: 26}})
    cart = Cart.init(cart).addOne(product)
      

        return res.render("cart/index", {cart})
    },
}