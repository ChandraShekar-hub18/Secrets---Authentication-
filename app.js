//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://chandrashekar:chandu123@cluster0.ohokhxh.mongodb.net/userDB")

const userSchema = {
  email: String,
  password: String
}

const User = new mongoose.model("User",userSchema);


app.get("/", ( req, res)=>{
  res.render("home");
})

app.get("/login", ( req, res)=>{
  res.render("login");
})

app.get("/register", ( req, res)=>{
  res.render("register");
})

app.post("/register", ( req, res)=>{
  const user = new User({
    email: req.body.username,
    password: req.body.password
  })
  user.save((err)=>{
    if(!err){
      res.send("Successfully registered");
    } else{
      res.send(err);
    }
  })
})



app.listen(3000,()=>{
  console.log("Server running on port 3000.")
})
