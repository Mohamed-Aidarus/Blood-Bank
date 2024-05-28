const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator"); // Importing validator
const bcrypt = require("bcryptjs");

// Define User schema
const userSchema = new Schema({
  fullname:  { type: String, required: [true, "fullname is required"] },
  email: { type: String, unique: true },
  age: Number,
  gender: { type: String, required: [true, "gender is required"] },
  address: String,
  bloodGroup: { type: String, required: [true, "bloodGroup is required"] },
  medicalCondition: {
    type: String,
    default: "None",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [false, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photo: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  role: {
    type: String,
    enum: ["admin", "recipient", "donor"],
    default: "donor",
  },
});
// Middleware to handle password confirmation only during password change
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  if (this.password !== this.passwordConfirm) {
    return next(new Error('Passwords are not the same!'));
  }

  this.passwordChangedAt = Date.now() - 1000; // Ensure the password change is recorded before token issuance
  next();
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 10);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async function (currentPassword, originalPassword) {
  if (!currentPassword || !originalPassword) {
    throw new Error('Both currentPassword and originalPassword need to be provided');
  }
  console.log(`Comparing passwords: ${currentPassword} and ${originalPassword}`);
  return await bcrypt.compare(currentPassword, originalPassword);
};

// Ensure the password is selected when querying the user
userSchema.pre('findOne', function() {
  this.select('+password');
});

userSchema.pre('findById', function() {
  this.select('+password');
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});



// BloodRequest Schema with Emergence Status
// BloodRequest Schema with Emergence Status and Requester Information
const bloodRequestSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  bloodGroup: String,
  medicalCondition: String,
  unit: Number,
  status: {
    type: String,
    enum: ["Approved", "Pending"],
  },
  action: {
    type: String,
    enum: ["Approve", "Reject"],
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const bloodUnitSchema = new Schema({
  bloodGroup: String,
  unit: Number,
  donor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// donateModel.js

const donateSchema = new Schema({
  bloodGroup: String,
  unit: Number,
  disease: String,
  age: Number,
  requestTimestamp: { type: Date, default: Date.now },
  donor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bloodUnit: {
    type: Schema.Types.ObjectId,
    ref: "BloodUnit",
    required: true,
  },
});

// Collections

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);
const Donate = mongoose.model("Donate", donateSchema);
const BloodUnit = mongoose.model("BloodUnit", bloodUnitSchema);
// Using corrected schema name
const User = mongoose.model("User", userSchema); // Using corrected schema name

// Export models
module.exports = {
  User,
  Donate,
  BloodRequest,
  BloodUnit,
};
