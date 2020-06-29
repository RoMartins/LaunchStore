const User = require ('../models/UserModel') 
const {FormatCpfCnpj, FormatCep } = require ('../../lib/functions')

module.exports = {
    registerForm(req,res) {
        return res.render("user/register")
    },
    async post(req, res){
       
        const user = await User.create(req.body)
        const userId = user.rows[0].id

        req.session.UserId = userId
        return res.redirect('/users')    
    },
    async show (req,res ){
        const{user} = req
        
        user.cpf_cnpj = FormatCpfCnpj(user.cpf_cnpj)
        user.cep = FormatCep(user.cep)

        return res.render('user/index', {user})
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
            await User.delete(req.body.id)
            req.session.destroy()

            return res.render("session/login", {
                success:"Conta deletada com sucesso"
            })

        }catch{
            console.log(err)
            return res.render("user/index", {
                error: 'Erro ao deletar conta'})
            
    }

},
}