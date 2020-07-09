const express = require('express')
const routes = express.Router()
const CartController = require('../app/controllers/CartController')

routes.get('/', CartController.index)
routes.post('/:id/add', CartController.addOne)
routes.post('/:id/remove', CartController.removeOne)
routes.post('/:id/delete', CartController.delete)



module.exports = routes
