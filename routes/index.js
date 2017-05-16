import express from 'express';
import mysql from 'mysql';
import passport from 'passport';
// import { LocalStrategy } from 'passport-local';
const LocalStrategy = require('passport-local').Strategy;

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

passport.serializeUser(function(user, done) {
  console.log('passport success');
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  // User.findById(id, function(err, user) {
  //   done(err, user);
  // });
  console.log('passport session get id : ', id);
  done(null, id);
});

passport.use('login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){
	console.log('local-join callback called');
	console.log(email, password, req.body);

	const query = connection.query('select * from Users where email=?', [email], function(err,rows){
		if(err) return done(err);
		
		var reg = /(^[-!#$%&'*+./0-9=?A-Z^_a-z{|}~]+)@[-!#$%&'*+/0-9=?A-Z^_a-z{|}~]+.[-!#$%&'*+./0-9=?A-Z^_a-z{|}~]+$/;
		if(rows.length){
			console.log('existed user');
			return done(null, false, {message: 'your email is already used'})
		} else{
			const sql = {
				email: email,
				name: email.replace(reg, '$1'),
				password: password
			};
			const query = connection.query('insert into Users set ?', sql, function(err, rows){
				if(err) throw err;
				console.log(rows);
				return done(null, {email: sql.email, name: sql.name, id: rows.insertId, message: 'ok'})	
			})
			
		}
	})
}))
passport.use('login2', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){
	console.log('local-join ajax callback');

	var query = connection.query('select * from user where email=?', [email], function(err, rows){
		if(err) return done(err);

		if(rows.length){
			return done(null, {'email': email, 'id': rows[0].UID});
		} else{
			return done(null, false, {'message': 'you ajax login is wrong'})
		}
	})
}
))

router.get('/', function(req,res){
	console.log("route /router path");
	// console.log(__dirname);
	// res.send("route /router path");
	// res.sendFile('main.html');
	res.sendFile("/Users/gimhwigyeom/Documents/passport-test/public/main.html");
})
router.get('/success', function(req,res){
	console.log("route /router/success path");
	console.log(req.user);

	res.sendFile("/Users/gimhwigyeom/Documents/passport-test/public/success.html");
})
router.get('/fail', function(req,res){
	console.log("route /router/fail path");
	var msg;
	var errMsg = req.flash('error');
	if(errMsg) msg = errMsg;
	console.log(msg);
	// console.log(__dirname);
	// res.send("route /router path");
	// res.sendFile('main.html');
	res.sendFile("/Users/gimhwigyeom/Documents/passport-test/public/fail.html");
})

router.post('/sign', function(req,res){
	console.log("route /route/sign path");
	console.log(req.body);

	var reg = /(^[-!#$%&'*+./0-9=?A-Z^_a-z{|}~]+)@[-!#$%&'*+/0-9=?A-Z^_a-z{|}~]+.[-!#$%&'*+./0-9=?A-Z^_a-z{|}~]+$/;
	var email = req.body.email;
	var name = email.replace(reg, '$1');
	var password = req.body.password;

	//삽입문
	var insertQuery = "insert into Users set ?";
	var insertData = {
		name: name,
		email: email,
		password: password
	}
	var query = connection.query(insertQuery, insertData, function(err, rows){
		if(err) throw err;
		console.log("ok db insert")
	})

})

router.post('/select', function(req,res){
	console.log("route /route/select path");

	var reg = /(^[-!#$%&'*+./0-9=?A-Z^_a-z{|}~]+)@[-!#$%&'*+/0-9=?A-Z^_a-z{|}~]+.[-!#$%&'*+./0-9=?A-Z^_a-z{|}~]+$/;
	var email = req.body.email;
	// var name = email.replace(reg, '$1');

	//조회문
	var selectQuery = "select name, email, password from Users where email=?";
	var selectData = {
		email: email
	}
	var query = connection.query(selectQuery, selectData, function(err,rows){
		if(err) throw err;
		if(rows[0]){
			console.log(rows[0]);
		} else{
			console.log('none : '+rows[0]);
		}
	})
})

router.post('/login', passport.authenticate('login',{
	successRedirect: '/success',
	failureRedirect: '/fail',
	failureFlash: true
})
)

router.post('/ajaxlogin', function(req, res, next){
	console.log("ajaxlogin path");
	passport.authenticate('login2', function(err, user, info){
		console.log(user);
		if(err) res.status(500).json(err);
		if(!user) return res.status(401).json(info.message);

		req.logIn(user, function(err){
			if(err) { return next(err); }
			return res.json(user);
		});
	})(req,res,next);
})

export default router;