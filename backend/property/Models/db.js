

const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql');


dotenv.config();


var connectionurl = process.env.url;
var databasename = process.env.database;
var dbusername = process.env.dbusername;
var dbpassword = process.env.dbpassword;
var dbport = process.env.dbport;

// var connectionurl = process.env.DATABASE_URL;
// var databasename = process.env.DATABASE_NAME;
// var dbusername = process.env.DATABASE_USER;
// var dbpassword = process.env.DATABASE_PASSWORD;
// var dbport = process.env.DATABASE_PORT;


var knex = require('knex')({
	client: 'mysql',
	connection:{

	host: connectionurl,
	user: dbusername,
	password: dbpassword,
	database: databasename,
	port: 3306,
	insecureAuth : true,
	timezone     : 'utc',
	}
});



module.exports={knex};
