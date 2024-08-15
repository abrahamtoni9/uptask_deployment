
const { Sequelize } = require('sequelize');
// TODO:extraer valores de variables .env
require('dotenv').config( { path:'variables.env' } );

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);

const db = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER,
  process.env.DB_PASS,
{
  host: process.env.DB_HOST,
  dialect: 'mysql',/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  port:process.env.DB_PORT,
  operatorsAliases:false,
  define:{
    timestamps:false
  },
  pool:{
    max:5,
    min:0,
    acquire:30000,
    idle:10000
  }
});  

module.exports = db;