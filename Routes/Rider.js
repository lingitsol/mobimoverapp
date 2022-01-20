
const express = require("express");
const { createRider, ImageStorage,riderPassUpdate, riderImages, createOTP, checkOTP } = require("../Controlers/RiderAction");

const router = express.Router();

//create the rider for signUP
router.post("/createRider",createRider);

//create riderDetail like taking images
const upload = ImageStorage.fields([{name:"Profile"},{name:"Card"},{name:"License"}]);
router.post("/riderDetail/:ID",upload,riderImages);

//this route is for update the password
router.post("/createOTP/:ID",createOTP);

//this route is for check otp
router.post("/checkOTP/:ID",checkOTP);

router.post("/riderPassUpdate/:EMAIL",riderPassUpdate);


module.exports=router;
