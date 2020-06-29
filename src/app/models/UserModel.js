const db = require("../../config/db");
const {hash} = require('bcryptjs');
const { array } = require("../middlewares/multer");
const productModel = require("./productModel");
const fs = require('fs')
module.exports = {

   async FindOne(filters) {
        let query = `SELECT * FROM users`

        Object.keys(filters).map(key =>{
            query = `${query} 
            ${key}
            `
            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

       const results = await db.query(query)
       return results.rows[0]
    },
     async create(data) {
        const query = `INSERT INTO users (
            name,
            email,
            password,
            cpf_cnpj,
            cep,
            address
            
        ) VALUES ($1,$2, $3,$4,$5, $6)
            RETURNING id
        `
// criptografia senha
            const password_hash = await hash(data.password, 8)

    const values = [
            data.name,
            data.email,
            password_hash,
            data.cpf_cnpj.replace(/\D/g,""),
            data.cep.replace(/\D/g,""),
            data.address,
            
        ]


        return db.query(query, values)
    },
    async update(id, fields){
        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array)=>{
            if(index + 1 < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            }else{
                query = `${query}
                ${key} = '${fields[key]}'
                WHERE id = ${id}
            `
            }

        })
        await db.query(query)
    },
    async delete(id){

        //pegar todos os produtos
        let results = await db.query("SELECT * FROM PRODUCTS WHERE user_id= $1", [id])
        const products = results.rows
        // dos produtos pegar as imagens
        const allFilesProduct = products.map(product =>
            productModel.files(product.id))
        
        let promiseResults = await Promise.all(allFilesProduct)    
       
        //remover usuario
        await db.query('DELETE FROM users WHERE id = $1',[id])

       //remover as imagens da pasta public
       promiseResults.map(results => {
        results.rows.map(file => {
            try {

                fs.unlinkSync(file.path)
            }catch(err) {
                console.error(err)
            }
        })
       })  
    }  

    
}