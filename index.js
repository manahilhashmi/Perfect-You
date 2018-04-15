const express = require('express');
const app = express();
const UserProvider = require('./userProvider');
const userProvider = new UserProvider();
function health(req,res){
	userProvider.getAll(function(docs){
		console.log(docs);
	});
	res.status(200).send('service is ok');
}
app.get('/health',health);
app.listen(3000,()=>console.log('listening at 3000'));
