const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const ProductController = require('../app/controllers/productController')
const {Permission} = require('../app/middlewares/session')


routes.get('/create',Permission, ProductController.create)
routes.get('/:id',ProductController.show)
routes.get('/:id/edit',Permission,ProductController.edit)
 
routes.post('/',multer.array("photos", 6),ProductController.post)
routes.put('/',Permission, multer.array("photos", 6) ,ProductController.put)
routes.delete('/',Permission, ProductController.delete)





module.exports = routes
