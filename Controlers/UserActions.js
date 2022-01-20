const User = require("../Models/UserSchema");
const bcrypt = require("bcrypt");
const { createToken } = require("../Authentication/authMiddleRoutes");


//for creatin user mean for signUP page
const createUser = async (req,res)=> {

    // const imageFile= req.file.filename;
    //calling model form schema
    const  user = await User({
        Name:req.body.Name,
        Email:req.body.Email,
        Phone:req.body.Phone,
        Password:req.body.Password,
        Confirm:req.body.Confirm,
    });
    //saving all data into database
    if(user.Password==user.Confirm)
    {
        user.save()
    .then(function (data) {
        res.send(data).message("Data has been saved");

    })
    .catch((err)=> {
        console.log("Error in saving user data",err);
        res.send("err",err);
    })

    }

    else
    {
        console.log("password and confirm password are not match");
    }


}

//for checking user logIn for logIN page
const loginUser =(req,res) => {
    const {pass,email} = req.body;
    console.log(email);
    //finding the user into database through email
    User.findOne({Email:email}, async (err,data) => {
        if(data)
        {
            //decode the password whic we hashed at the time of saving in database
            const match = await bcrypt.compare(pass,data.Password);
            if(match)
            {
                //here we create the token every time when user is login
                const token = createToken(data._id);
                res.cookie("JWT_Verification",token);
                res.send("User is register");
                console.log("user is register");
            }
            else
            {
                res.send("Password is wrong");
                console.log("password is wrong");
            }
        }
        else
        {
            res.send("User is not authentic");
            console.log("Email is wrong");
        }
        if(err)
        {
            res.send("Error in user login functionality");
            console.log("Error in user login functionality");
        }
    });
}


module.exports= {
    createUser,
    loginUser,
}
