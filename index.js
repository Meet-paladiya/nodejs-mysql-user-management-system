const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));  //views name nu folder banavvanu and 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db_app', // aapda dataase nu name nakhvu
    password: 'Mysql@981'
  });

  let  getRandomUser = () => {
    return [
      faker.string.uuid(),
      faker.internet.username(),
      faker.internet.email(),
      faker.internet.password()
    ];
  };


//Home Route
app.get("/",(req,res) => {
  let q = `SELECT count(*) FROM user`;
try{
      connection.query(q,(err,result) => { // connection.query e q ne run karva mate
        if(err) throw err;
        let count = result[0]["count(*)"]; 
        res.render("home.ejs",{ count }); //callback no response che
      })}
      catch(err) {
        console.log(err);
        res.send("Having an Error in the DB");
      } 
})

//Show Route
app.get("/user",(req,res)=> {
  let q = `SELECT * FROM user`;

  try{
    connection.query(q,(err,users) => {
      if(err) throw err;
      res.render("showusers.ejs", {users})
      })
      }
      catch(err) {
        console.log(err);
        res.send("Having an Error in the DB");
        }
});

//Edit  Route.  .. we only gats form to update
app.get("/user/:id/edit", (req,res)=> {
let {id} = req.params;
let q = `SELECT * FROM user WHERE id ='${id}'`; // as a string moklava '' karva

try{
  connection.query(q,(err,result) => {
    if(err) throw err;
    let user = result[0];
    res.render("edit.ejs",{user});
  })
    }
    catch(err) {
      console.log(err);
      res.send("Having an Error in the DB");
      }
});


//UPDATE (DB) Route
app.patch("/user/:id",(req,res) => {
  let {id} = req.params;
  let{password :formPass, username : newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id ='${id}'`; // as a string moklava '' karva
  
  try{
    connection.query(q,(err,result) => {
      if(err) throw err;
      let user = result[0];
      if(formPass != user.password){
        res.send("Password is not correct");
      }
      else{
        let q2 = `UPDATE user SET username ='${newUsername}' WHERE  id ='${id}'`;
        connection.query(q2,(err,result) => {
          if(err) throw err;
          res.redirect("/user");
        });

      } 
    });
      }
      catch(err) {
        console.log(err);
        res.send("Having an Error in the DB");
        }
})

app.listen("8080", () => {
  console.log("server is running on port 8080");
});

//   let q = "INSERT INTO user (id,username,email,password) VALUES ?";
//   // let users =[ ["12b","meetb","meet@gmail.comb","meet123b"], ["12bc","meetbc","meet@gmail.combc","meet123bc"]];

//  let data = [];
//  for (let i = 0; i < 100; i++) {
//       data.push(getRandomUser()); //100 fake user
//     }


// try{
  //     connection.query(q,[data],(err,result) => {
  //       if(err) throw err;
  //       console.log(result);  // result is a array which contains the objects as a element
  //       console.log(result.length);
  //       console.log(result[0]);
  //       console.log(result[1]);
  //     })}
  //     catch(err) {
  //       console.log(err);
  //     }
  
  // connection.end();
  
