const { Pool } = require("pg")

module.exports = new Pool({
user:'postgres',
password:"rafael1804",
host: "localhost",
port:5432,
database:"ecommerce2"

})