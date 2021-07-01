//sequelize for mysql
const Sequelize = require('sequelize');
//environment
require('dotenv').config();
let sequelize;
//using JAWSDB MYSQL here to link database to  heroku. JAWSDB URL Var is accessed via Heroku dashboard.
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
//if JAWSDB not working, program knows to host locally using localhost. Using root/root login info for this and default port 3306. Tech_blog  is db NAME.
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: 'localhost',
        dialect: 'mysql',
        username: "root",
        password: "root",
        port: 3306,
        database: "tech_blog"
    });
}
module.exports = sequelize;