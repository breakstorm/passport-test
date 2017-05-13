import express from 'express';

const app = express();
const router = express.Router();

app.use(express.static('/Users/gimhwigyeom/Documents/passport-test/public'));

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
	res.send(responseData);
})

export default router;