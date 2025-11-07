import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
     googleId: {
      type: String,
      unique: true,
      sparse: true, // <-- allows multiple null/undefined values
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required: function () {
        return !this.googleId; // If a user logs in via Google (googleId), they may not have a password. In that case false otherwise true
      },
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dm0rlehq8/image/upload/v1751560449/default_user_sij8ek.jpg",
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
   verificationToken: {
  type: String,
},
verificationTokenExpiresAt: {
  type: Date,
},

})

userSchema.index({ googleId: 1, email: 1 }, { unique: true, sparse: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
