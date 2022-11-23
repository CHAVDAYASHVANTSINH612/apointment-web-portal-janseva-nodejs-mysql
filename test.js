const mysql=require('mysql');
const express = require('express')
const app = express();
const port = 3000


const db=mysql.createConnection({

    host:'localhost',
    user:'root',
    password:'',
    // database:'test1'
    database:'mydb'
});

db.connect(function(err) {
    
    console.log("Connected!");

   var sql1="CREATE DATABASE mydb";
    var sql2= "CREATE TABLE customer (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255))";
    db.query(sql2, function (err, result) {
    
      console.log("table created");

    });
  });
  



const name='yashvantsinh';
const email='yashvantsinhchavda2461@gmail.com';


app.get('/insert', (req, res) =>{


  var sql_data=`INSERT INTO customer (name,email) VALUES('${name}','${email}')`;

  db.query(sql_data,(err,result)=>{
    // if(err) throw err;
    console.log("data inserted");
  })

 
   
})

app.get('/qrprint',(req,res)=>{

  res.render('')

});





app.listen(port, () => console.log(`Example app listening on port ${port}!`))