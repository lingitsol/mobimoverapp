const { Rider, riderDetial, otpRider } = require("../Models/RiderSchema");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
//here we are creating the rider for sign up

const createRider = async (req, res) => {
    const rider = await Rider({
        Name: req.body.Name,
        Email: req.body.Email,
        Phone: req.body.Phone,
        Password: req.body.Password,
        Confirm: req.body.Confirm,
    });
    if (rider.Password == rider.Confirm) {
        rider.save().then((data) => {
            res.json(data);
            console.log("Rider has been created");
        }).catch(err => {
            console.log("Error in rider creation", err)
        })
    }
    else {
        console.log("Passwod and confirm passowrd are not matched");
        res.send("Passwod and confirm passowrd are not matched");
    }
}


//here are making storage folder where pics will be store
const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        //first parameter is error is null and second is folder name where file is going to be store
        cb(null, "./pics")
    },
    filename: (req, file, cb) => {
        //first parameter is error is null and second is file name where file had into local system
        cb(null, Date.now() + "--" + path.extname(file.originalname));

    }
});
//here assigning the diskStorage to storage
const ImageStorage = multer({ storage: storageEngine });


const riderImages = async (req, res) => {

    const profile = req.files.Profile[0].filename;
    const card = req.files.Card[0].filename;
    const license = req.files.License[0].filename;
    const id = req.params.ID;
    console.log(profile, card, license);
    const images = await riderDetial({
        ProfileImage: profile,
        CardImage: card,
        LicenseImage: license,
        riderID: id,
        //    PermitImage:permit,
    });

    images.save().then(function (data) {
        console.log("Images of rider has been saved");
        res.send(data);
    }).catch(err => {
        console.log("Error in imges uploadation of rider");
        res.send(err);
    })

};

const sendOTP = async (email, otp) => {
    const OTP = String(otp);
    //we are making transport for sedngin the email
    const transport = await nodemailer.createTransport({
        // host: "qaiernuman74@gmail.com",
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: 'qaisernuman74@gmail.com',
            pass: 'PAKLHRsa572',
        }
    })
    //fro send email
    await transport.sendMail({
        from: "qaisernuman74@gmail.com",
        to: email,
        subject: "Assalam-o-Aliakum",
        //  html: '<h1>Hello, my name is <span id="name"></span></h1><script> let name = "Nathan";document.getElementById("name").innerHTML = "Numan";</script>',
        text: OTP,

    }, function (err, info) {
        if (err) {
            console.log("from Email sending error : ", err);
        }
        else {
            console.log("Email has been send", info.response);
        }
    })

}
//for creating OTP  by Email
const createOTP = (req, res) => {
    const id = req.params.ID;
    console.log(id);
    const Email = req.body.Email;
    const otp = Math.floor(Math.random() * 10000 + 1);
    Rider.findOne({ Email: Email }, async (err, data) => {
        if (data) {
            const saveOTP = await otpRider({
                otpCode: otp,
                riderId: id,
                expireIn: new Date().getTime() + 300 * 1000,
            })
            saveOTP.save().then(data => {
                sendOTP(Email, otp);
                console.log("Email has been sent and otp generated");
                res.send({ Data: data, message: "Email has been send otp generated" });

            }).catch(err => {
                console.log("Error in otp creation");
                res.send({ err: err, message: "error in otp creation" });
            })

        }
        else {
            console.log("Email is not register");
            res.status(404).send("Email is not register");
        }
        if (err) {
            console.log("Erro in rider OTP generation");
            res.send("Erro in rider OTP generation");
        }
    })
}

//check otp
const checkOTP = (req, res) => {
    const id = req.params.ID;
    const otp = req.body.otp;
    const time = new Date().getTime();
    otpRider.findOne({ riderId: id }, (err, data) => {
        if (err) {
            res.send({ Error: err, message: "Opt is not correct" });
        }
        if (data) {

            const chekcExpiry = data.expireIn - time;

            if (chekcExpiry > 0) {
                //
                if (otp == data.otpCode) {
                    //otp is correct updated 204
                    res.status(204).send({ message: "password updated" })
                    console.log("Password updated");
                }
                else {
                    res.status(404).send({ message: "not matched" })
                }
            }
            else {
                //otp expired
                otpRider.findByIdAndDelete(data._id, (err, data) => {
                    if (err) {
                        // res.send({error:err});
                        console.log("Error in update pass saving");
                    }
                    if (data) {
                        // res.send({Data:data});
                        console.log("OTP  expired deleted");
                    }
                })
            }


        }
    })
}

//for update the pass word
const riderPassUpdate = (req, res) => {
    const email = req.params.EMAIL;
    if (req.body.Password == req.body.Confirm) {

        if(req.body.Password.length>=8)
        {
            Rider.findOne({ Email: email }, (err, data) => {
                if (err) {
                    res.send({ Error: err });
                    console.log("Eror in password updation");
                }
                if (data) {
                    data.Password = req.body.Password;
                    data.Confirm=req.body.Confirm;
                    res.status(200).send({ DATA: data, message: "Updated pass" });
                    console.log("Password updated successfully");
                    //for saving into database
                    data.save().then((data)=> {
                        // res.status(204).send({ mesage: "modified" ,data:data});
                        console.log("modified");
                    }).catch(err => {
                        // res.send({ error: err });
                        console.log(err);
                    })
                }
                else {
                    res.send("Email is not find");
                    console.log("Email is not find")

                }

            })
        }
        else{
            res.send("Password is less than 8 digits");
            console.log("pass is less than 8 digits")
        }

    }
    else {
        console.log("Password and Confirm Password are not matched");
        //not modified 304 error
        res.status(200).send("Pass & Confirm not matched");
    }

}

module.exports = {
    createRider,
    riderImages,
    createOTP,
    checkOTP,
    riderPassUpdate,
    ImageStorage
}
