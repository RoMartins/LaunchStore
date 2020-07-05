 const express = require('express')
 const routes = express.Router()
 const SessionController = require('../app/controllers/SessionController')
 const UserController = require('../app/controllers/UserController')
 const PedidosController = require('../app/controllers/PedidosController')
 const UserValidator = require('../app/validators/user')
 const SessionValidator = require('../app/validators/session')
 const {isLogged, Permission} = require('../app/middlewares/session')
// // login/logout
routes.get('/login', isLogged, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout' , SessionController.logout) 

// // reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password' ,SessionValidator.forgot, SessionController.forgot) 
routes.post('/password-reset' ,SessionValidator.reset, SessionController.reset) 

// // user register 
routes.get('/register', UserController.registerForm)
routes.post('/register',UserValidator.post, UserController.post)

routes.get('/',Permission,UserValidator.show, UserController.show)
routes.put('/',UserValidator.update, UserController.update)
routes.delete('/', UserController.delete)

routes.get('/ads',UserController.ads )

routes.post('/pedidos', Permission,PedidosController.post)
routes.get('/pedidos', (req,res) => res.render('pedido/error') )


 module.exports = routes
