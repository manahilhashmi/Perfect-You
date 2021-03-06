const express = require('express');
const app = express();
const UserProvider = require('./userProvider');
const userProvider = new UserProvider();
const passport = require('passport');
const Strategy = require('passport-local').Strategy;



app.set('view engine','pug');
app.use(require('morgan')('combined'));
app.use(express.static('public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({secret:'perfect you', resave:false, saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());




passport.use(new Strategy(
    function(username,password,cb){
        userProvider.findByUsername(username,password,function(err,user){
            if(err) {return cb(err);}
            if(!user) {return cb(null,false);}
            return cb(null,user);
        });
    }));

passport.deserializeUser(function(id,cb){
    userProvider.findById(id,function(err,user){
        if(err) { return cb(err);}
        cb(null,user);
    });
});

passport.serializeUser(function(user,cb){
    cb(null,user._id);
});

function health(req,res){
	userProvider.getAll(function(docs){
	});
	res.status(200).send('service is ok');
}

app.get('/health',health);
app.get('/',(req,res)=>{
    res.render('index',{user:req.user});
});
app.get('/log.html',(req,res)=>{
    res.render('login');
});
app.get('/home.html',
    require('connect-ensure-login').ensureLoggedIn('/log.html'),
    function(req,res){
        if(req.user.results){
        progress = Math.trunc((Object.keys(req.user.results).length/30)*100);
        res.render('home',{user:req.user,progess:progress})}
        else{
            res.render('home',{user:req.user});
        }
});
app.get('/tool.html',
    require('connect-ensure-login').ensureLoggedIn('/log.html'),
    function(req,res){
        res.render('tool',{user:req.user});
});
app.get('/score.html',
    require('connect-ensure-login').ensureLoggedIn('/log.html'),
    function(req,res){
        res.render('score',{user:req.user});
});
app.get('/toolEnd.html',
    require('connect-ensure-login').ensureLoggedIn('/log.html'),
    function(req,res){
        res.render('toolEnd',{user:req.user});
});
app.get('/questions.html',
    require('connect-ensure-login').ensureLoggedIn('/log.html'),
    function(req,res){
        res.render('questions',{user:req.user,manahil:false});
});
app.post('/register',(req,res)=>{
    userProvider.saveUser(req.body,function(err,user){
        if(err)
            res.status(300).send(err);
        else
            res.redirect('/');
    });
});
app.post('/login',
    passport.authenticate('local',{successReturnToOrRedirect:'/home.html',failiureRedirect: '/log.html'}),
    function(req,res){
        res.redirect('/home.html');
    });
app.get('/logOut.html',(req,res)=>{
    req.logout();
    res.render('logOut');
});
app.post('/saveResults',(req,res)=>{
	userProvider.saveResults(req.user._id,req.body,function(err){
		if(err)
			res.sendStatus(400);
		else
			res.sendStatus(200);
	});
});
app.get('/all',(req,res)=>{
	userProvider.getAll(function(docs){
		res.send(docs);
	})
});
app.listen(3000,()=>console.log('listening at 3000'));
