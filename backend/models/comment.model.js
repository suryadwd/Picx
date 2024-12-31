import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    require:true,
  },
  text:{
    type:String,
    require:true,
  },
  post:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
    require:true,
  }

},{timestamps:true})

const  Comment = mongoose.model("Comment",commentSchema)

export default Comment