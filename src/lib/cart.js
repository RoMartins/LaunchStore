const {FormatPrice} = require("../lib/functions")
// carrinho fica guardado na sessao (req.session)

const Cart = {
    init(oldCart){
        if(oldCart){

            this.items = oldCart.items
            this.total = oldCart.total
        }
         else {
        this.items = []
        this.total = {
            quantity: 0,
            price : 0,
            formatPrice : FormatPrice(0)
          
           }
        }
        return this
    },
    addOne(product){
        // ver se o produto já existe no carrinho
        let inCart = this.items.find(item => item.product.id == product.id)
        // se não existe
        if(!inCart) {
            inCart = {
                product:{
                    ...product,
                    formatPrice : FormatPrice(product.price)
                },
                quantity: 0,
                price : 0,
                formatPrice : FormatPrice(0)
            }
            this.items.push(inCart)
        }
        if(inCart.quantity == product.quantity) return this

        inCart.quantity++
        inCart.price = inCart.product.price * inCart.quantity
        inCart.formatPrice = FormatPrice(inCart.price)
        
        this.total.quantity++
        this.total.price += inCart.product.price
        this.total.formatPrice = FormatPrice(this.total.price)
        

        return this
    },
    removeOne(productId){
        // pegar item no carrinho
        const inCart = this.items.find(item => item.product.id == productId)
        if(!inCart) return this

        //atualiza item
        inCart.quantity --
        inCart.price = inCart.product.price * inCart.quantity
        inCart.formatPrice = FormatPrice(inCart.price)

        // atualiza carrinho
        this.total.quantity--
        this.total.price -= inCart.product.price
        this.formatPrice = FormatPrice(this.total.price)

        
    },
    delete(productId){},
}
const product = {
    id: 1 ,
    price: 200,
    quantity: 2,
}

const product2 = {
    id: 2 ,
    price: 300,
    quantity: 2,
}
    console.log('first');
    let oldcart = Cart.init().addOne(product)
    console.log(oldcart);
    
    console.log('second');
     oldcart = Cart.init(oldcart).addOne(product)
    console.log(oldcart);

    console.log('third');
     oldcart = Cart.init(oldcart).addOne(product2)
    console.log(oldcart);


    



module.exports = Cart