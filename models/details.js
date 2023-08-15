const mongoose=require("mongoose");

const DetailSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model("Detail",DetailSchema);