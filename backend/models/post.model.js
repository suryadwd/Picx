import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  image:{
    type:String,
    require:true,
  },
  caption:{
    type:String,
    default:""
  },
  likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }],
  comments:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Comment"
  }]


},{timestamps:true})
const  Post = mongoose.model("Post",postSchema)
export default Post