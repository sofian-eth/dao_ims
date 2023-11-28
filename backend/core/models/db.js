const dotenv = require('dotenv').config();


var connectionurl = process.env.url || process.env.DATABASE_URL;
var databasename = process.env.database || process.env.DATABASE_NAME;
var dbusername = process.env.dbusername || process.env.DATABASE_USER;
var dbpassword = process.env.dbpassword || process.env.DATABASE_PASSWORD;

var knex = require('knex')({
	client: 'mysql',
	connection:{

	host: connectionurl,
	user: dbusername,
	password: dbpassword,
	database: databasename,
	port: 3306,
	insecureAuth : true
	}
});



module.exports={knex};



