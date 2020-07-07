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
        this.total.formatPrice = FormatPrice(this.total.price)

        if(inCart.quantity ==0){
            const itemIndex = this.items.indexOf(inCart)
            this.items.splice(itemIndex, 1)
            return this
        // Outra forma
        // this.items = this.items.filter(item => item.product.id != inCart.product.id) return this
        }

        return this


    },
    delete(productId){
        const inCart = this.items.find(item => item.product.id == productId)
        if(!inCart) return this

        if(this.items.length >0) {
            this.total.quantity -= inCart.quantity
            this.total.price -= (inCart.product.price * inCart.quantity)
            this.total.formatPrice = FormatPrice(this.total.price)
        }
        this.items = this.items.filter(item => inCart.product.id != item.product.id)
        
        return this
    },
}


module.exports = Cart