const express = require("express");
const userRouter = express.Router();

const upload = require("../utils/upload");

const {createUser,OTPVerification,checkUserActive,GetUser,getAllUsers,forgotPassword,resetPassword,updateUser,deleteUser, createUsers } = require('../Controllers/UserController');


userRouter.post("/",upload.single("photo"), createUser);
userRouter.post("/CreateUsers",upload.array("photo"), createUsers);




userRouter.delete("/:id", deleteUser);
userRouter.post("/forgotPassword",forgotPassword);

// userRouter.post("/ResetPassword",resetPassword);

userRouter.patch("/:id",upload.single("photo"),updateUser);
userRouter.get("/", getAllUsers);


// userRouter.use(checkUserActive); 
userRouter.post("/login",GetUser);



module.exports = userRouter;

