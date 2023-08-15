const mongoose=require("mongoose");

const OrderSchema=mongoose.Schema({
    order:{
        type:Array,
        required:true
    },
    id:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model("Order",OrderSchema);