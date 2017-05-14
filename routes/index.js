import express from 'express';
import mysql from 'mysql';

const app = express();
const router = express.Router();
const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'dev',
	password: '123qwe',
	database: 'bookflex'
})


app.use(express.static('/Users/gimhwigyeom/Documents/passport-test/public'));
connection.connect();

router.get('/', function(req,res){
	console.log("route /router path");
	// console.log(__dirname);
	// res.send("route /router path");
	// res.sendFile('main.html');
	res.sendFile("/Users/gimhwigyeom/Documents/passport-test/public/main.html");
})

router.post('/sign', function(req,res){
	console.log("route /route/sign path");
	console.log(req.body);

	var responseData = {
		'result': 'ok',
		'email': req.body
	}

	var email = req.body.email;
	var responseData = {};
	//조회문
	// var query = connection.query('select name, email, password from Users where name="' + email + '"', function(err,rows){
	// 	if(err) throw err;
	// 	if(rows[0]){
	// 		console.log(rows[0]);
	// 	} else{
	// 		console.log('none : '+rows[0]);
	// 	}
	// })
	//삽입문
	var insertQuery = "insert into Users (name, email, password) set ?";
	var insertData = {
		name: email,
		email: email,
		password: email
	}
	var query = connection.query(insertQuery, insertData, function(err, rows){
		if(err) throw err;
		console.log("ok db insert")
	})
	// res.send(responseData);
})

export default router;