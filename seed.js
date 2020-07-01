const User = require('./src/app/models/UserModel')
const {hash} = require('bcryptjs')
const { has } = require('browser-sync')
const faker = require('faker') 
const Product = require('./src/app/models/productModel')
const File = require('./src/app/models/FileModel')

let usersId = []
let TotalProducts = 10
let Totalusers = 3

async function createUsers(){
    const users = []
    const password = await hash('rodrigo',8)

    while(users.length < Totalusers){

        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            cpf_cnpj: faker.random.number(99999999),
            cep: faker.random.number(99999999),
            address: faker.address.streetName(),
            password,            
        })
    }
    
    const usersPromise = users.map(user => User.create(user))
    usersId = await Promise.all(usersPromise)
}

async function createProducts(){
    let products = []

    while (products.length < TotalProducts){
        products.push({
            category_id: Math.ceil(Math.random() * 3),
            user_id: usersId[(Math.floor(Math.random() * Totalusers))],
            name: faker.name.title(),
            description : faker.lorem.paragraph(Math.ceil(Math.random() * 8)),
            price : faker.random.number(9999999),
            old_price : faker.random.number(9999999),
            quantity : faker.random.number(99),
            status: Math.round(Math.random())
        })
    }
    const productsPromise = products.map(product => Product.create(product))
    productsId = await Promise.all(productsPromise)

    let files = []
    while(files.length<50) {
            files.push({
            name: faker.image.image(),
            path:`public/images/placeholder.png`,
            product_id: productsId[(Math.floor(Math.random() * TotalProducts))],
            })
    }
    const FilesPromise = files.map(file => File.create(file))
        await Promise.all(FilesPromise)
}

async function init(){
    await createUsers()
    await createProducts()
}

init()