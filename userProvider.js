const monk = require('monk');
const bcrypt = require('bcrypt');

const url = 'localhost:27017/users';
var db = null;
var UserProvider = function (){
	db = monk(url,function(err,db){
		console.log(err);
		console.log(db);
	});
		
}

UserProvider.prototype.getAll = function (callback){
	collection = db.get('users');
	collection.find().then(docs=>{
		callback(docs);
	}).catch(err=>{
		console.log(err);
	});
}

module.exports = UserProvider;
