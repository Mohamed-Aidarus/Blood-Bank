const express = require("express");
const userRouter = express.Router();


const upload = require("../utils/upload");

const {createUser,OTPVerification,checkUserActive,getUser,getAllUsers,forgotPassword,resetPassword,updateUser,deleteUser, createUsers ,search } = require('../Controllers/UserController');


userRouter.post("/",upload.single("photo"), createUser);
userRouter.post("/CreateUsers",upload.array("photo"), createUsers);




userRouter.delete("/", deleteUser);
userRouter.post("/forgotPassword",forgotPassword);

userRouter.post("/resetPassword",resetPassword);

userRouter.patch("/",upload.single("photo"),updateUser);
userRouter.get("/", getAllUsers);

userRouter.get("/search",search);

// userRouter.use(checkUserActive); 
userRouter.post("/login",getUser);



module.exports = userRouter;

