const monk = require('monk');
const bcrypt = require('bcrypt');
const SaltRounds = 10;
const url = 'mongodb://manahil:hashmi@ds231589.mlab.com:31589/users';
var db = null;
var UserProvider = function (){
	db = monk(url,function(err,db){
        console.log(err);
	});
}

UserProvider.prototype.getAll = function (callback){
	collection = db.get('testUsers');
	collection.find().then(docs=>{
		callback(docs);
	}).catch(err=>{
		console.log(err);
	});
}

UserProvider.prototype.findByUsername = function (username,password,callback) {
    collection = db.get('testUsers');
    collection.findOne({username:username}).then(user=>{
        bcrypt.compare(password,user.password,function(err,res){
            if(err) {return callback(err)}
            if(res)
                callback(null,user);
            else
                callback(null,null);
        });
    }).catch(err=>{
        console.log(err);
        callback( new Error('User ' + username + ' does not exist'));
    });
}

UserProvider.prototype.findById = function (id,callback){
    collection = db.get('testUsers');
    collection.findOne({_id:id}).then(user=>{
        callback(null,user);
    }).catch(err=>{
        console.log(err);
        callback( new Error('User ' + id + ' does not exist'));
    });
}

UserProvider.prototype.saveUser = function (user,callback){
    console.log(user);
    collection = db.get('testUsers');
    collection.findOne({username:user.username}).then(thisUser=>{
        if(thisUser)
            callback(new Error('user already exists'));
        else{
            bcrypt.hash(user.password,SaltRounds,function(err,hash){
                if(err) { return callback(err) }
                user.password = hash;
                collection.insert(user).then((user)=>{
                    callback(null,user);
                }).catch(err=>{
                    callback(err);
                });
            });
        }
    }).catch(err=>{
        callback(new Error(JSON.stringify(err)));
    });
}

UserProvider.prototype.saveResults = function(userid,data,callback){
	collection = db.get('testUsers');
	collection.findOne({_id:userid}).then(user=>{
		if(!user.results)
			user.results = data;
		else
			user.results = Object.assign({},user.results,data);
		collection.update({_id:userid},user).then(results=>{
			callback();
		}).catch(err=>{
			callback(err);
		});
	}).catch(err=>{
		callback(err);
	});
}
UserProvider.prototype.geAll = function(callback){
	collection = db.get('testUsers');
	collection.find().then(docs=>{
		callback(docs);
	}).catch(err=>{
		callback(err);
	});
}
module.exports = UserProvider;
