const User = require ('../models/UserModel')
const {compare} = require('bcryptjs')

async function login(req, res, next) {
    //verificar se o usuario está cadastrado

    //verificar se o password bate

    // colocar o usuário no req.session

    const {email, password} = req.body

        const user = await User.FindOne({where: {email}})

        if(!user) res.render('session/login', {
            user:req.body,
            error:"Usuário não encontrado!"
        })

        const passed = await compare(password, user.password)

    if(!passed) return res.render('session/login', {
        user:req.body,
        error:"Senha incorreta"
    })

        req.user = user

        next()
}

async function forgot(req, res, next){
    const {email} = req.body

    try{
        let user = await User.FindOne({where: {email}})
        
        if(!user) res.render('session/forgot-password', {
            user:req.body,
            error:"Email não encontrado!"
        })

        req.user = user
        next()
    }catch{
        console.error(err);
    
    }
}

async function reset(req, res, next){
    const {email, password, passwordRepeat, token} = req.body
    
     //procurar o usuário
     const user = await User.FindOne({where: {email}})

        if(!user) res.render('session/password-reset', {
         user:req.body,
        token,
         error:"Usuário não encontrado!"
     })
        //ver se a senha bate
        if(password != passwordRepeat) 
        return res.render('session/password-reset', {
           user : req.body,
           token,
           error:'Senhas não conferem'
        }) 
        //verificar se token bate 
        if(token != user.reset_token) 
        return res.render('session/password-reset', {
            user : req.body,
            token,
            error:'Token inválido, solicite uma nova recuperação de senha!'
         }) 
        //verificar se token expirou
         let now = new Date()
         now = now.setHours(now.getHours())

         if(now > user.reset_token_expires)
         return res.render('session/password-reset', {
            user : req.body,
            token,
            error:'Token expirado, solicite uma nova recuperação de senha!'
         }) 

         req.user = user  
         next()
    }
 
module.exports = {
    login,
    forgot,
    reset
}