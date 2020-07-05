
const LoadProductsService = require("../services/LoadProductService")
const User = require ('../models/UserModel') 
const mailer = require("../../lib/mailer")

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
            //pegar dados do produto
            const  product = await LoadProductsService.load('product', {where:{
                id : req.body.id
            }})
            //dados do vendedor
            const seller = await User.FindOne({where: {id: product.user_id}})
            // dados do comprador
            const buyer = await User.FindOne({where: {id: req.session.UserId}})
            //enviar email com dados da compra para o vendedor
            await mailer.sendMail({
                to: seller.email,
                from:' no-reply@launchstore.com.br ',
                subject: 'Novo pedido de compra',
                html: email(seller, product, buyer),
            })
            // notificar o usúario com alguma mensagem
            return res.render('pedido/success')
        } catch (error) {
            
            console.error(error);
            return res.render('pedido/error')

            
        }


        if(!products) return res.send("Produto não encontrado")
    
      

        return res.render("home/index", {products})
    },
}