const Category = require("../models/Category")

async function post(req, res, next){

    const keys = Object.keys(req.body)

    const categories = await Category.FindAll()

    for(key of keys){
        if(req.body[key] == "") return res.render("products/create.njk",
            {
                error:"Preencha todos os campos",
                product: req.body,
                categories,
        })
    }

    if(req.files.length == 0)
            return res.render("products/create.njk",
            {
                error:"Envie pelo menos uma foto",
                product: req.body,
                categories

        })
        next()
}        
async function put(req, res, next){

     const keys = Object.keys(req.body)
    for(key of keys){
        if(req.body[key] == "" && key!= "removed_files") return res.render("products/create.njk",
        {
            error:"Preencha todos os campos",
            product: req.body,
            categories,
    })
}
    next()
}

module.exports = {
    post,
    put
}