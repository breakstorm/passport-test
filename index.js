// const express = require('express')
import express from 'express';
import path from 'path';

// import router from './routes';

const app = express();
const staticPath = path.resolve(__dirname, 'routes');


app.get('/', function (req, res) {
	console.log(staticPath);
  res.send('Hello World!')
})

app.listen(4000, function () {
  console.log('Example app listening on port 3000!')
})