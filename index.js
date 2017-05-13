// const express = require('express')
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import router from './routes';


const app = express();
const staticPath = path.resolve(__dirname, 'public');
const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'dev',
	password: '123qwe',
	database: 'bookflex'
})

connection.connect();
app.use(express.static(staticPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/', router);
app.use(cors({
	origin:'http://127.0.0.1:4000',
	optionsSuccessStatus: 200
},{
	origin:'http://localhost:4000',
	optionsSuccessStatus: 200
}
));

app.get('/', function (req, res) {
	console.log(staticPath);
  res.send('Hello World!')
})

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
})