const User = require ('../models/UserModel')
const {compare} = require('bcryptjs')

function checkAllFields(body){
    const keys = Object.keys(body)
    for(key of keys){
        if(body[key] == "")
         return {
            user: body,
            error : 'Preencha todos os campos'
         }
    }
}

async function post(req,res, next) {
     //check if has all fields
    const fillAllFields = checkAllFields(req.body)
    
    if(fillAllFields){
        return res.render("user/register", fillAllFields)
    }
     //check if user exists [email, cpf_cnpj]
     let { email, cpf_cnpj, password,passwordRepeat} = req.body
     
     cpf_cnpj = cpf_cnpj.replace(/\D/g,"")

     const user = await User.FindOne({
         where:{email}, 
         or:{cpf_cnpj}
     })
     
     if(user) return res.render('user/register', {
         user : req.body,
         error:'Usuário já cadastrado'
     })
     // check if password match 
     if(password != passwordRepeat) 
         return res.render('user/register', {
            user : req.body,
            error:'Senhas não conferem'
         })   
         next()
}
async function show(req, res, next) {
    const {UserId : id} = req.session

        const user = await User.FindOne({where: {id}})

        if(!user) res.render('user/register', {
            error:"Usuário não encontrado!"
        })

        req.user = user

        next()
}
async function update(req, res, next){
    const fillAllFields = checkAllFields(req.body)
    
    if(fillAllFields){
        return res.render("user/index", fillAllFields)
    }
    const {id, password} = req.body

    if(!password) return res.render('user/index', {
        user:req.body,
        error:"Coloque sua senha para atualizar o cadastro"
    })

    const user = await User.FindOne({where : {id}})

    const passed = await compare(password, user.password)

    if(!passed) return res.render('user/index', {
        user:req.body,
        error:"Senha incorreta"
    })

    req.user = user

    next()



}

 
module.exports = {
    post,
    show,
    update
}