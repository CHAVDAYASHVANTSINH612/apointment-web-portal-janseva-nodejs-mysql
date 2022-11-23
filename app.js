const express = require('express');
const path = require('path');
const pug = require('pug');
const mysql = require('mysql');
const { error } = require('console');
const bodyparser = require("body-parser");  // it is needed when you have to gate form data req.body.anything

const { get } = require('http');

src = "https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js";

// new Date object
let b_date = new Date();


const app = express();


app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded());


// app.use(express.static(static_path));

app.get('/', (req, res) => {

    res.render('index');
});

app.get('/bookap', (req, res) => {

    res.render('bookap');
});

app.get('/register', (req, res) => {

    res.render('register');
});

app.get('/login', (req, res) => {

    res.render('login');
});

app.get('/selectdate', (req, res) => {

    res.render('selectdate');
});


app.post('/bookap', (req, res) => {      // same as '/contact' in contact.pug form action

    succes_msg = ' ';
    fail_msg = ' ';

    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hello_db"

    });
    db.connect((err) => {
        if (err) throw err;

        console.log('database connected');

    })

    var reason = req.body.reason;
    var name1 = req.body.name1;
    var phone = req.body.phone1;
    var email = req.body.email1;
    var day = req.body.day;
    var month = req.body.month;
    var year = req.body.year;
    var time = req.body.time;
    var message = req.body.message1;
    var bookdate = b_date;








    var sql_row_count = `SELECT COUNT(*) FROM adhar`;

    var sql_if_timeslot_full = ` SELECT COUNT(*) FROM ${reason}${day}${month}${year}${time} `;
    //  var sql_table_exists=`SELECT COUNT(*)
    //  FROM 
    //     information_schema.TABLES 
    //  WHERE 
    //     TABLE_SCHEMA LIKE 'hello_db' AND 
    //      TABLE_NAME = '${reason}${date}${time}'; `


    // create table if not exist syntax :
    // CREATE TABLE IF NOT EXISTS `test` (
    //     `id` int(11) NOT NULL,
    //     `name` varchar(50) NOT NULL,
    //     `address` int(11) NOT NULL,
    //     `phone` int(11) NOT NULL,
    //     PRIMARY KEY (`id`)
    //   ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

    var sql_create_table = `CREATE TABLE IF NOT EXISTS   ${reason}${day}${month}${year}${time}(id INT NOT NULL AUTO_INCREMENT, reason VARCHAR(35),date  VARCHAR(35) , time INT, name VARCHAR(35) NOT NULL,phone VARCHAR(15), email VARCHAR(35),message VARCHAR(255),bookdate VARCHAR(20),PRIMARY KEY (id) )ENGINE=InnoDB DEFAULT CHARSET=latin1`;


    var sql_insert = `  INSERT INTO ${reason}${day}${month}${year}${time}(reason,date,time,name,phone,email,message,bookdate) VALUES('${reason}','${day}-${month}-${year}','${time}','${name1}','${phone}','${email}','${message}','${b_date}')`;
    var sql_timeslot_full = `SELECT COUNT(*) FROM electioncard WHERE date='${day}-${month}-${year}' AND time='${time}'`

    //   db.query(sql_timeslot_full,(err,result)=>{
    //     if(err) throw err;
    //      else{


    //         if(result.length<=16){

    //             db.query(sql_insert,(err,result)=>{
    //                  if(err) throw err;
    //                  else{


    //                   console.log(result);

    //                      console.log(`data inserted your appointment is booked for ${reason} on date ${date} time: ${time} `);
    //                     res.send(`data inserted your appointment is booked for ${reason} on date: ${date} time around: ${time} `);

    //                     }

    //             });

    //         }
    //         else{


    //      res.send('time slots are full')


    //         }




    //      }
    // });


    if (name1.length != 0) {

        db.query(sql_create_table, (err, result) => {

            var resList = [];

            if (err) throw err;
            else {

                db.query(`SELECT * FROM  ${reason}${day}${month}${year}${time}`, (err, rows, fields) => {  // for getting   rows.lenth

                    if (err) {
                        res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
                    }
                    else {

                        if (rows.length <= 4) {

                            db.query(sql_insert, (err, result) => {
                                if (err) throw err;
                                else {




                                    console.log(result);

                                    //  console.log(`data inserted your appointment is booked for ${reason} on date ${day}-${month}-${year} time: ${time} `);
                                    // res.send(`data inserted your appointment is booked for ${reason} on date: ${day}-${month}-${year} time around: ${time} `, );

                                    var succes_msg = ` data inserted succesfully , your appointment is booked for ${reason} on date: ${day}-${month}-${year} time around: ${time}`;

                                    res.render('bookap', { 'success_message': succes_msg })



                                }

                            });
                        }
                        else if (rows.length > 4) {
                            // res.send("time slot full please select another time slot")
                            var fail_msg = "This time slot full please select another time slot"
                            res.render('bookap', { 'fail_message': fail_msg })

                        }
                        else {
                            // res.send('err dont know');
                            var fail_msg = 'unknown err'
                            res.render('bookap', { 'fail_message': fail_msg })
                        }

                    }

                });






            }




        });

    }
    else {
        // res.send("time slot full please select another time slot")
        var fail_msg = "PLEASE ENTER SOME DATA FIRST"
        res.render('bookap', { 'fail_message': fail_msg })

    }


    //    db.query(sql_table_exists,(err,result)=>{

    //     //  if(err) throw err; 
    //     //  else{

    //                if(result == 0){
    //                    console.log('you are in 0');

    //                  db.query(sql_create_table,(err,result)=>{

    //                     if(err)     throw err;
    //                     else{
    //                         console.log(`new table created ${reason}${date}${time} `);
    //                         db.query(sql_insert,(err,result)=>{
    //                             if(err) throw err;
    //                              else{
    //                                       console.log(result);

    //                                       console.log(`data inserted your appointment is booked for ${reason} on date ${date} time: ${time} `);
    //                            res.send(`data inserted your appointment is booked for ${reason} on date ${date} time around: ${time} `);
    //                              }
    //                         });


    //                      }

    //                db.query(sql_insert,(err,result)=>{


    //                 // });

    //             });


    //         });
    //     }
    //         else{

    //           db.query(sql_row_count,(err,result)=>{

    //             // if(err) throw err;
    //             // else{
    //                 if(result<11){
    //                     db.query(sql_insert,(err,result)=>{

    //                         res.send(`data inserted your appointment is booked for ${reason} on date ${date} time: ${time} `);


    //                     });
    //                 }
    //                 else{
    //                         res.send('timeslot is full')

    //                 }
    //             // }




    //           });




    //         }

    //     // }


    //       });

});













app.post('/showdata', function (req, res) {

    var personList = [];
    var selectedreason = req.body.reason;
    var selectedday = req.body.selectedday;
    var selectedmonth = req.body.selectedmonth;
    var selectedyear = req.body.selectedyear;
    var selectedtime = req.body.selectedtime;

    // Connect to MySQL database.
    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hello_db"

    });
    db.connect((err) => {
        if (err) throw err;

        console.log('database connected');

    })

    // Do the query to get data.
    // db.query(`SELECT * FROM adhar WHERE date='${selectedday}-${selectedmonth}-${selectedyear}'`, function(err, rows, fields) {
    db.query(`SELECT * FROM ${selectedreason}${selectedday}${selectedmonth}${selectedyear}${selectedtime}`, function (err, rows, fields) {
        if (err) {
            //   res.status(500).json({"status_code": 500,"status_message": "internal server error"});
            res.send(err);
            throw err;



        } else {
            // Loop check on each row
            for (var i = 0; i < rows.length; i++) {

                // Create an object to save current row's data
                var person = {
                    'reason': rows[i].reason,
                    'name': rows[i].name,
                    'email': rows[i].email,
                    'phone': rows[i].phone,
                    'date': rows[i].date,
                    'time': rows[i].time,
                    'message': rows[i].message,
                    'id': rows[i].id,
                    'bookdate': rows[i].bookdate
                }
                // Add object into array
                personList.push(person);
            }

            // Render index.pug page using array 
            res.render('showdata', { "personList": personList });
        }
    });

    // Close the MySQL connection
    db.end();

});



app.post('/register', (req, res) => {


    var email1 = req.body.email;
    var password1 = req.body.password;
    var confpassword1 = req.body.confpassword;

    if (password1 == confpassword1) {

        const db = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "hello_db"

        })

        db.connect((err) => {

            // if(err) throw err;
            console.log("connected");

        })


        var sql3 = `SELECT email WHERE email=${email1}`;

        const sqlSearch = "SELECT * FROM user WHERE email = ?"
        const search_query = mysql.format(sqlSearch, [email1])
        const sqlInsert = "INSERT INTO user VALUES (?,?)"
        const insert_query = mysql.format(sqlInsert, [email1, password1])

        db.query(search_query, (err, result) => {

            // if(result != email1){
            //     db.query(`INSERT INTO user (email,password) VALUES('${email1}','${password1}')`,(err,result)=>{
            //         res.send('data inserted');
            //     });
            // }

            if (result.length != 0) {

                console.log("------> User already exists")
                res.send("------> User already exists")
                // res.sendStatus(409) 


            }
            else {
                db.query(insert_query, (err, result) => {
                    res.send('data inserted');
                });
            }
        });

    }
    else {

        res.send(' confirm  password not maching ');
        //    document.getElementById('message').innerHTML='not maching';


    }


});



app.post('/login', (req, res) => {


    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hello_db"

    })

    db.connect((err) => {

        // if(err) throw err;
        console.log("connected");

    })


    var emaillogin = req.body.emaillogin;
    var passwordlogin = req.body.passwordlogin;

    // res.send(`${email1} ${password1}`);




    var sql3 = `SELECT password FROM user WHERE email = '${emaillogin}'`


    db.query(sql3, (err,rows, result) => {
        if (err) {
            throw err;
        }
        else if (rows.length != 0) {

            // res.send(rows[0].password)

            if (rows[0].password == passwordlogin) {

                res.render('selectdate');

            }
            else {

                res.render('login', { fail_message: "Wrong Password" });

            }

        }
        else {
            res.render('login', { fail_message: "Wrong Email" });
        }


    });




});



app.get('/details', function (req, res) {

    // db.query('SELECT * From user', function (error,rows) {
    // //  if (error) throw error;
    // //  console.log('The solution is: ', results);

    // //   res.render('details', {
    // //     title: 'Details - Pug ExpressJS NodeJS Tutorial',
    // //     users: results
    // //   });

    // // });

    // res.render('profile', { data: rows });

    // });
});


app.get('/data', (req, res) => {

    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hello_db"

    })

    db.query('SELECT * From user', (error, results, fields) => {

        res.render('index', {
            title: 'Details - Pug ExpressJS NodeJS Tutorial',
            users: fields
        });
        console.log(results);


    })


});



// not nessesory code: 

app.get('/createdb', (req, res) => {

    const db = mysql.createConnection({

        host: "localhost",
        user: "root",
        password: ""

    })
    db.connect((err) => {
        console.log('connected');
    });

    var sql = `CREATE DATABASE hello_db`;

    db.query(sql, (err, result) => {
        //    if(error){
        //      throw error;
        //    }
        //    else{
        res.send('database created');
        //    }

    })

    console.log("database created");



});

app.get('/createtable:name', (req, res) => {

    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hello_db"

    })
    db.connect((err) => {
        console.log('connected');
    })

    var table_name = req.params['name'];

    var sql2 = `CREATE TABLE IF NOT EXISTS   ${table_name}(id INT NOT NULL AUTO_INCREMENT, reason VARCHAR(35),date  VARCHAR(35) , time INT, name VARCHAR(35),phone INT, email VARCHAR(35),message VARCHAR(255),PRIMARY KEY (id) )`;

    db.query(sql2, (err, result) => {
        if (err) throw err;

        res.send(`table  ${table_name} created`);

    })

    console.log("table created");



});



app.listen(5000, () => {
    console.log(`listening on port 5000`);
});






