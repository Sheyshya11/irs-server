const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: [true, "Please provide first name"] },
  lastname: { type: String, required: [true, "Please provide last name"] },
  username: {
    type: String,
    required: [true, "Please provide your username"],
    unique: [true, "Username exists"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: true,
  },
  department:{
    type: String,
    required:false
  },
  password: {
    type: String,
    required: false,
    unique: false,
  },
  roles:{
    type: String,
    default: "User"
  },
  verified:{
    type:Boolean,
    default: false
  }

  
});

module.exports =  mongoose.model("User", userSchema);
