const session = require('express-session');
const mysql2 = require('mysql2/promise');
const MySQLStore = require('express-mysql-session')(session);
const config = require('./config')

const connection = mysql2.createPool(config);
const sessionStore = new MySQLStore({}, connection);
module.exports = sessionStore;