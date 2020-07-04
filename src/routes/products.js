const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const ProductController = require('../app/controllers/productController')
const {Permission} = require('../app/middlewares/session')
const ProductValidator = require('../app/validators/product')


routes.get('/create',Permission, ProductController.create)
routes.get('/:id',ProductController.show)
routes.get('/:id/edit',Permission,ProductController.edit)
 
routes.post('/',multer.array("photos", 6),ProductValidator.post,ProductController.post)
routes.put('/',Permission, multer.array("photos", 6) ,ProductValidator.put, ProductController.put)
routes.delete('/',Permission, ProductController.delete)





module.exports = routes
