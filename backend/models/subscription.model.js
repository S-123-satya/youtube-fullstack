import mongoose,{Schema} from "mongoose";

const subscriptionSchema= new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    chennel:{
        type:Schema.Types.ObjectId,
        required:true,
    }
},{timestamps:true});

export const Subscription= mongoose.model("Subscription",subscriptionSchema);