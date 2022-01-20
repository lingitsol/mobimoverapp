const express= require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const UserRoutes = require("./Routes/User");
const RiderRoutes = require("./Routes/Rider");
//mongoDB connection setup
mongoose.connect("mongodb+srv://kingitsol:kingitsol!!22@cluster0.mymqp.mongodb.net/FoodApp?retryWrites=true&w=majority",{
    useNewUrlParser:true,
});
//making sure that setup has been made or not
mongoose.connection.once("open", function(){
    console.log("Mongodb connection has been made.");
})
const app= express();
const port = process.env.PORT || 4000;

//middlewares for passing data
app.use(bodyParser.urlencoded({extended:true,limit:'50mb',parameterLimit:1000000}));
app.use(bodyParser.json({extended:true,limit:'50mb',parameterLimit:1000000}));
app.use(express.json());
//for saving the image thst's why setting this folder static
app.use(express.static('pics'));
app.use(express.static(path.join(__dirname, "pics")));
//for parsing he cookie
app.use(cookieParser());
//routes middlewares
app.use(UserRoutes);
app.use(RiderRoutes);

//for testing routes
app.get("/hello",(req,res)=> {
    res.send("Hello");
})
app.get("/hey",(req,res)=> {
    res.send("Heey")
});
app.get("/test",(req,res)=> {
  res.send("kingitsol");
})

app.listen(port, function(){
    console.log("Server is running.",port)
})
