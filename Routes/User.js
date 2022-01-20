const express = require("express");
const { checkToken } = require("../Authentication/authMiddleRoutes");
// const { sendTokenID } = require("../Authentication/UserAuth");
const { createUser,loginUser } = require("../Controlers/UserActions");
const router = express.Router();


//this route for createing the user into database (SignUP)
//here we pass the middleware of storing image which the image who has the name is Image
router.post("/createUser",createUser);

//this route for login the user
router.post("/login",loginUser);

//for checking the authentication that user is not or valid
router.get("/get-cookie/:id",checkToken, (req,res)=> {
    const identity = req.params.id;


    if(identity)
    {
        res.send("welcome");
        console.log("welcome");
    }
    else
    {
        res.send("This token is not belong to you");
        console.log("This token is not belong to you");
    }

});

module.exports=router;
