//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5")
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://chandrashekar:chandu123@cluster0.ohokhxh.mongodb.net/userDB")

const userSchema = mongoose.Schema({
  email: String,
  password: String
})



const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) => {
  res.render("home");
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  console.log(email, password);
  User.findOne({
    email: email
  }, (err, foundUser) => {
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, (err, result)=>{
        console.log(foundUser.password);
        console.log(password);
        console.log(result);
        if(result){
          res.render("secrets");
        }
        else {
          res.send("Wrong password");
        }
      })
    //   if (foundUser.password === password) {
    //     res.render("secrets");
    //   } else {
    //     res.send("Wrong password");
    //   }
    // } else {
    //   res.send("err");
  } else{
    res.send(err);
  }
  })
})

app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/register", (req, res) => {

  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {

    const user = new User({
      email: req.body.username,
      password: hash
    })
    user.save((err) => {
      if (!err) {
        res.send("Successfully registered");
      } else {
        res.send(err);
      }
    })

  })
})

app.get("/logout", (req, res) => {
  res.redirect("/");
})


app.listen(3000, () => {
  console.log("Server running on port 3000.")
})
