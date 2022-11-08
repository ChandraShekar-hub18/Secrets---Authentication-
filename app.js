  //jshint esversion:6

  //main config
  require('dotenv').config()
  const express = require("express");
  const bodyParser = require("body-parser");
  const ejs = require("ejs");
  const mongoose = require("mongoose");
  const md5 = require("md5")
  const session = require('express-session')
  const passport = require('passport');
  const LocalStrategy = require('passport-local');
  const passportLocalMongoose = require('passport-local-mongoose');

  const app = express();

  app.use(express.static("public"));
  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(session({
    secret: "Our little Secret",
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize());
  app.use(passport.session());

  //mongoose configuration
  mongoose.connect("mongodb+srv://chandrashekar:chandu123@cluster0.ohokhxh.mongodb.net/userDB")

  const userSchema = mongoose.Schema({
    email: String,
    password: String
  })

  userSchema.plugin(passportLocalMongoose);

  const User = new mongoose.model("User", userSchema);

  //passport configuration
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  //route configuration
  app.get("/", (req, res) => {
    res.render("home");
  })

  app.get("/secrets", ( req, res)=>{
    if(req.isAuthenticated()){
      res.render("secrets");
    } else{
      res.redirect("/login");
    }
  })

  app.get("/login", (req, res) => {
    res.render("login");
  })

  app.post("/login", (req, res) =>{
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
    req.login(user, (err) => {
      if(err){
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, ()=>{
          res.redirect("/secrets");
      })
    }
  })
    
    })


  app.get("/register", (req, res)=>{
    res.render("register");
  })

  app.post("/register", (req, res) => {
    User.register({username: req.body.username}, req.body.password, (err, user)=>{
      if(err){
        console.log(err);
        res.redirect("/register");
      } else{
      passport.authenticate("local")(req, res, ()=>{
        res.redirect("/secrets");
      })
      }
    })
  })

  app.get("/logout", (req, res) => {
    req.logout((err) => {
      if(err) {
        console.log(err);
      } else {
        console.log("logout completed");
        res.redirect("/");
      }
    })
  })


  app.listen(3000, () => {
    console.log("Server running on port 3000.")
  })