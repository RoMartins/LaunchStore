const db = require("../../config/db");

module.exports = {

    all() {
       return db.query(`SELECT name, id FROM categories`)
    }

}