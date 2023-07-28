require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const encrypt=require("mongoose-encryption");
const app=express();
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
const { MongoDBCollectionNamespace } = require('mongodb');
const mongoose=require('mongoose');
const { resourceLimits } = require("worker_threads");
 mongoose.connect("mongodb://127.0.0.1:27017/userDb",{useNewUrlParser:true});
 const userSchema= new mongoose.Schema({
    Email: String,
    Password: String
  });

  userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["Password"]})
  const User=mongoose.model("User",userSchema);
app.get("/",function(req,res)
{
    res.render("home");
}
)
app.get("/login",function(req,res)
{
    res.render("login");
}
)
app.post("/login",function(req,res)
{
    async function login()
    {
        const result= await User.find({Email:req.body.username});
        console.log(result);
      
        if(result.length!=0)
        {
            
            if(result[0].Password===req.body.password)
            {
            res.render("secrets");
            }
            else
            {
                res.send("Incorrect Password");
            }
        }
        else
        {
            res.send("Invalid Details");
        }
    }
    login();
}
)
app.get("/register",function(req,res)
{
    res.render("register");
}
)
app.post("/register",function(req,res)
{
    const email=req.body.username;
    const password=req.body.password;
    const user=new User({
        Email:email,
        Password:password
    })
     if(user.save())
     {
        res.render("secrets");
     }
     else
     {
        res.send("Failed to Register Try Again Later");
     }
}
)
app.listen(3000,function(req,res){
    console.log("Server Started on port 3000");
    })