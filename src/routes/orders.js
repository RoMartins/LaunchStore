const express = require('express')
const routes = express.Router()
const PedidosController = require('../app/controllers/PedidosController')
const {Permission} = require('../app/middlewares/session')

routes.get('/', PedidosController.index)
routes.get('/sales', PedidosController.sales)
routes.get('/:id', PedidosController.show)
routes.post('/:id/:action',Permission, PedidosController.update)

routes.post('/', Permission,PedidosController.post)





module.exports = routes
