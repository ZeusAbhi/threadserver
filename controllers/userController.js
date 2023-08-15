const userModel = require("../models/user");
const detailModel=require("../models/details")
const orderModel=require("../models/orders")
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const SECRET_KEY="baamzigar";
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existinguser = await userModel.findOne({ email: email });
    if (existinguser) {
      return res.status(400).json({ message: "User Already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userModel.create({
      email: email,
      password: hashedPassword,
      name: name,
    });
    res.status(201).json({ message: "Account Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const signin = async (req, res) => {
  const {email,password}=req.body

  try{
    const existingUser=await userModel.findOne({email:email});
    if(!existingUser){
      return res.status(404).json({message:"User not found"});
    }
    const matchPassword=await bcrypt.compare(password,existingUser.password)
    if(!matchPassword){
      return res.status(400).json({message:"Invalid Credentials"})
    }
    const token=jwt.sign({email:existingUser.email,id:existingUser._id},SECRET_KEY,{
      expiresIn:"15 days"
    })
    res.status(201).json({user:existingUser,token:token});
  } catch(error){
    console.log(error);
    res.status(500).json({message:"something went wrong"});
  }
};

const details=async (req,res)=>{
  const{email,phone,address}=req.body
  await detailModel.create({
    email: email,
    phone: phone,
    address:address
  });

  try{
    const data = await detailModel.find({email});
    res.json(data); 
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
}
}
const getDetails = async (req, res) => {
  try {
    const data = await detailModel.find();
    console.log(data);
    if (data.length > 0) {
      res.json(data);
    } else {
      res.json([]); // Return an empty array when no data is found
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const validateToken = async (req, res) => {
  try {
    const token = req.body.token; 
    const decoded = jwt.verify(token, SECRET_KEY);

    // Token is valid
    res.status(200).json({ message: 'Token is valid', decoded });
  } catch (error) {
    // Token verification failed
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};
const order=async(req,res)=>{
  const order=req.body.order
  const id=req.body.id
  if(!order){
    console.error("Yo, WTF?!")
    return;
  }
  console.log(order);
  try{
  await orderModel.create({
    order:order,
    id:id
  })
  res.status(201).json({ message: "Order Saved" });
 } catch (err) {
  console.log(err);
  res.status(500).json({ message: "something went wrong" });
  }
}
const getorder=async(req,res)=>{
  const id=req.body.id
  try {
    const data = await orderModel.find({id});
  
    if (data.length > 0) {
      res.json(data);
    } else {
      res.json([]); // Return an empty array when no data is found
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { signup, signin,details,getDetails,validateToken,order,getorder };
