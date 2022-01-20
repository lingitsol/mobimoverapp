const mongo = require("mongoose");
const bcrypt = require("bcrypt");
const schema = mongo.Schema;
const RiderSchema = new schema(
    {
        Name: {
            type: String,
            required: true,
        },
        Email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            // validate:["Emial must be valid"]

        },
        Phone: {
            type: Number,
            required: true,
            trim: true,
            minlength: 10,

        },
        Password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
        },
        Confirm: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
        },

    },
    {
        timestamps: true,
    }
);
//for hashing the password before saving into database
RiderSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    //assign the hashing password to password field by this variable
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
});

const RiderDetail = new schema({
    ProfileImage: {
        type: String,
        required: true
    },
    CardImage: {
        type: String,
        required: true
    },
    LicenseImage: {
        type: String,
        required: true
    },
    riderID:{
        type:String,
        required:true
    }
    // PermitImage:{
    //     type:String,
    // }

});
const RiderOTP = new schema({
    otpCode: {
        type: Number,
        required: true
    },
    riderId:{
        type:String,
        required:true
    },
    expireIn:{
        type:Number
    }
},
    {
        timestamps: true
    }
)
const Rider = mongo.model("riders", RiderSchema);
const riderDetial = mongo.model("riderDetails", RiderDetail);
const otpRider = mongo.model("riderOtps",RiderOTP);

module.exports = {
    Rider,
    riderDetial,
    otpRider
}
