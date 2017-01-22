var express = require('express');
var app = express();
app.use(express.static('public'));

var MongoClient = require('mongodb').MongoClient

app.get('/index.htm', function (req, res) {
res.sendFile( __dirname + "/" + "index.htm" );
})

app.get('/login.htm', function (req, res) {
res.sendFile( __dirname + "/" + "login.htm" );
})
app.get('/register.htm', function (req, res) {
res.sendFile( __dirname + "/" + "register.htm" );
})
app.get('/login_access', function (req, res) {
// Prepare output in JSON format
response = {
user_name:req.query.user_name,
password:req.query.password
};
console.log(response);
MongoClient.connect('mongodb://localhost:27017/zippia', function (err, db) {
  if (err) throw err
  db.collection('users').find().toArray(function (err, result) {
    if (err) throw err
     user_details= {}
     valid_user=0
     for (user in result){
        if (result[user]["user_name"]===response["user_name"] && result[user]["password"]===response["password"]){
         user_details= result[user]
         valid_user=1
         break;
        }
     }
     if (valid_user===1){
	res.end(("Hello:"+response["user_name"]+"\n"+
                 "User Details:"+ "\n"+
                 JSON.stringify(user_details)))
     }else{
     res.end("correct details or register  user")
    }
    
  })
})
})

app.get('/new_register', function (req, res) {
// Prepare output in JSON format
response = {
first_name:req.query.first_name,
last_name:req.query.last_name,
password1:req.query.password1,
password2:req.query.password2,
location:req.query.location
};
console.log(response);
if (response["password1"]===response["password2"]){
 response["user_name"]= response["first_name"][0]+response["last_name"]+response["location"].substr(0,3)
 response['password']= response['password1']
 delete response['password1']
 delete response['password2']
 MongoClient.connect('mongodb://localhost:27017/zippia', function (err, db) {
  if (err) throw err
  db.collection('users').find({'user_name':response["user_name"]}).toArray(function (err, result) {
    if (err) throw err
     if (result.length===0){
	db.collection('users').save(response)
        res.end("Sucessfully registered:\nUserName:"+response["user_name"]);
     }else{
     res.end("User already registerd")
    }
    
  })
 }) 
}else{
 res.end("Password1 and Password2 are not same!");
}

})


var server = app.listen(8081, function () {
var host = server.address().address
var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)
})
