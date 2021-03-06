const express = require('express')
const routes = express.Router()

const SearchController = require('../app/controllers/SearchController')
const HomeController = require('../app/controllers/HomeController')
const users = require('./users')
const products = require('./products')
const  cart = require('./cart')
const  orders = require('./orders')


routes.get('/products/search', SearchController.index)
routes.get('/' , HomeController.index)

routes.use('/products', products)
routes.use('/users', users)
routes.use('/cart', cart)
routes.use('/orders', orders)




routes.get('/ads/create' ,(req ,res) => {
    return res.redirect("/products/create")
})


routes.get('/accounts' ,(req ,res) => {
    return res.redirect("/users/login")
})


module.exports = routes