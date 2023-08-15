const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const cors=require("cors")
const mongoose = require("mongoose");
require("dotenv").config()


app.use(express.json());
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));
const cors = require('cors');
const corsOptions ={
    origin:process.env.FRONTEND_URL, 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use("/users", userRouter);
const stripe=require('stripe')(process.env.STRIPE_KEY)
mongoose
  .connect(`${process.env.MONGO_URL}`)
  .then(() => {
    app.listen(5000, () => {
      console.log("server started");
    });
  })
  .catch((err) => console.log(err));

  app.post('/create-checkout-session', async (req, res) => {
    const {  cart, exchangeRate } = req.body;
    
    const StoreItems = new Map(cart.items.map((e) => [e.variant_id, {
      priceInRupees: parseInt(e.unit_price*exchangeRate),
      name: e.title
    }]));
    try{
      const session=await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        mode:'payment',
        line_items:cart.items.map((e)=>{
          const storeItem=StoreItems.get(e.variant_id)
          return{
            price_data:{
              currency:'inr',
              product_data:{
                name:storeItem.name
              },
              unit_amount:(storeItem.priceInRupees)
            },
            quantity:e.quantity
          }
        }),
        success_url:`${process.env.FRONTEND_URL}/paymentsuccess`,
        cancel_url:`${process.env.FRONTEND_URL}/paymentfail`
      })
      res.json({url:session.url})
    }catch(e)
    {
      res.status(500).json({error:e.message})
    }
  
  });
