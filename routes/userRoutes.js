const express=require("express");
const { signup, signin ,details, getDetails, validateToken, order, getorder} = require("../controllers/userController");

const userRouter=express.Router();

userRouter.post("/signup",signup);
userRouter.post("/signin",signin)
userRouter.post("/savedetails",details)
userRouter.get("/getdetails",getDetails)
userRouter.post("/validatetoken",validateToken)
userRouter.post("/orders",order)
userRouter.post("/getorder",getorder)
module.exports=userRouter;