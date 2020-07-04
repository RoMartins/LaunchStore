const {hash} = require('bcryptjs');
const fs = require('fs')

const Product =  require ('../models/productModel') 
const User = require ('../models/UserModel') 
const {FormatCpfCnpj, FormatCep } = require ('../../lib/functions');
const  LoadProductService = require('../services/LoadProductService')


module.exports = {
    registerForm(req,res) {
        return res.render("user/register")
    },
    async post(req, res){
       try {
           let {name, email, password, cpf_cnpj ,cep, address} = req.body

            password = await hash(password, 8)
           cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
           cep = cep.replace(/\D/g,"")

       
           const userId = await User.create({
            name, 
            email, 
            password, 
            cpf_cnpj,
            cep,
            address
           })

        
           req.session.UserId = userId
        
           return res.redirect('/users') 

    } catch (error) {
        console.error(error);
        
    }   
    },
    async show (req,res ){
        try {
            const{user} = req
        
            user.cpf_cnpj = FormatCpfCnpj(user.cpf_cnpj)
            user.cep = FormatCep(user.cep)
    
            return res.render('user/index', {user})
        } catch (error) {
            console.error(error);
            
        }
       
    },
    async update (req, res) {
        try{
            const {user} = req 
            let {name, email, cpf_cnpj, cep,address} = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")

            await User.update(user.id, {
                name, 
                email,
                cpf_cnpj,
                cep,
                address
            })

            return res.render("user/index", {
                user:req.body,
                success: "Conta atualizada com sucesso"
            })


        }catch(err){
            console.log(err)
                return res.render("user/index", {
                    error: 'Algum erro aconteceu!'
                })
        }
    },
    async delete (req, res) {

        try {

            //pegar todos os produtos
            let products = await Product.FindAll({where: {user_id: req.body.id}})
        
            // dos produtos pegar as imagens
            const allFilesProduct = products.map(product =>
                Product.files(product.id))
            
            let promiseResults = await Promise.all(allFilesProduct)    
           
        
            await User.delete(req.body.id)
            req.session.destroy()

            promiseResults.map(filesProduct => {
                filesProduct.map(file => {
                    try {
        
                        fs.unlinkSync(file.path)
                    }catch(err) {
                        console.error(err)
                    }
                })
               })  


            return res.render("session/login", {
                success:"Conta deletada com sucesso"
            })

        }catch(err){
            console.error(err)
            return res.render("user/index", {
                error: 'Erro ao deletar conta'})
            
    }

},
    async ads(req,res) {
            
        const products = await LoadProductService.load('products',{
            where:{ user_id: req.session.UserId}
        })
        return res.render("user/ads", {products})
    }
}