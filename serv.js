var express = require('express');
var main = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";
var bodyParse = require('body-parser');

main.use(express.static(__dirname + "/front"));
main.use(bodyParse.json());

main.get('/contact',function(req,res){
	//console.log("Data transferred.");
	MongoClient.connect(url, function(err,db) {
	    if (err) throw err;
	    var dbo = db.db("contact");
	    //Find all documents in the collection:
	    dbo.collection("contact").find({}).toArray(function(err,result) {
	    	if(err) throw err;
	    	//console.log(result);
	    	res.json(result);
	    	//db.close();
	    });
	});
});

main.post('/newCont',function(req,res){
	//console.log(req.body);
	MongoClient.connect(url, function(err,db) {
	    if(err) throw err;
	    var dbo = db.db("contact");
	    //Insert a new record in the collection:
	    dbo.collection("contact").insertOne(req.body,function(err,Result){
	    	if(err) throw err;
	    	dbo.collection("contact").find({}).toArray(function(err,result){
	    		if(err) throw err;
	    		res.json(result);
	    	});
	    });
	});
});

main.delete('/delCont/:id',function(req,res){
	var id = req.params.id;
	//console.log(id);
	MongoClient.connect(url, function(err,db) {
	    if(err) throw err;
	    var dbo = db.db("contact");
	    var qry = { _id: ObjectId(id) };
	    //Delete a record in the collection:
	    dbo.collection("contact").deleteOne(qry,function(err,Result){
	    	if(err) throw err;
	    	dbo.collection("contact").find({}).toArray(function(err,result){
	    		if(err) throw err;
	    		res.json(result);
	    	});
	    });
	});
});

main.get('/edCont/:id',function(req,res){
	var id = req.params.id;
	//console.log(id);
	MongoClient.connect(url, function(err,db) {
	    if(err) throw err;
	    var dbo = db.db("contact");
	    var qry = { _id: ObjectId(id) };
	    //Edit a record in the collection:
	    dbo.collection("contact").findOne(qry,function(err,result){
	    	if(err) throw err;
	    	res.json(result);
	    });
	});
});

main.put('/upCont/:id',function(req,res){
	var id = req.params.id;
	//console.log(req.body.name);
	MongoClient.connect(url, function(err,db) {
	    if(err) throw err;
	    var dbo = db.db("contact");
	    var qry = { _id: ObjectId(id) };
	    var newval = { $set: {name:req.body.name, phno:req.body.phno, email:req.body.email} };
	    //Update a record in the collection:
	    dbo.collection("contact").updateOne(qry,newval,function(err,Result){
	    	if(err) throw err;
	    	dbo.collection("contact").find({}).toArray(function(err,result){
	    		if(err) throw err;
	    		res.json(result);
	    	});
	    });
	});
});

main.listen(12000);

console.log("port 12000 activated");