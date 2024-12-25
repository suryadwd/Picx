import User from "../models/user.model"
import Post from "../models/post.model.js"
import streamifier from "streamifier"
import Comment from "../models/comment.model.js"

export const createPost = async (req, res) => {

  try {
    
    const userId = req.user._id

    const image = req.file
  
    const caption = req.body
  
    if(!image) return res.status(401).json({Message:"image required"})
  
    let cloudResponse;
    
        if (image) {
          const uploadStream = (buffer) => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                  if (result) {
                    resolve(result);
                  } else {
                    reject(error);
                  }
                }
              );
              streamifier.createReadStream(buffer).pipe(stream);
            });
          };
    
          cloudResponse = await uploadStream(image.buffer); // Use buffer directly
        }
  
    const user = await User.findById(userId)
    
    if(!user) return res.status(401).json({Message:"user not found"})
  
    const post = new Post({user:userId,image:cloudResponse.secure_url,caption})
  
    await post.save()

    if(user){
      user.posts.push(post._id)
      await user.save()
    }

    await post.populate({path:'author',select:"-password"})
    
    return res.status(201).json({success:true,message:"post created",post})

  } catch (error) {
    
  }

}

export const getAllPost = async (req, res) => {

  try {
    const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({ path: "user", select: "-password" })
    .populate({
      path: "comments",
     sort: { createdAt: -1 } , // Use options for sort on populated fields
      populate: { path: "user", select: "-password" },
    }); 
    if(!posts) return res.status(404).json({message:"no post"})
    return res.status(200).json({success:true,posts})
  } catch (error) {
    return res.status(500).json({message:error.message}) 
  }

}

export const getUserPost = async (req, res) => {

  try {
    const userId = req.user._id

  const post = await Post.findById(userId).sort({createdAt:-1}).populate({
    path:"user",
    select:("-password")
  }).populate({
    path:"comments",
    select:("-password")
  })

  if(!post) return res.status(404).json({message:"no post from user"})

    return res.status(200).json({success:true, post})

  } catch (error) {
    return res.status(500).json({message:error.message})
  }

}

export const like = async (req, res) => {
  try {
    
    const userId = req.user._id

    const {id:postId} = req.params

    const post = await Post.findById(postId)

    if(!post) return res.status(404).json({message:"no post found"})

    const isLike = await Post.likes.include(userId)

    if(!isLike){
      await Post.findByIdAndUpdate(postId,{$push:{likes:userId}},{new:true})

      return res.status(201).json({message:"You likes the post"})
    }else{
      await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}},{new:true})
      return res.status(201).json({message:"You dislikes the post"}) 
    }

  } catch (error) {
        return res.status(500).json({message:error.message})
  }
}

export const addComment = async (req, res) => {

  try {
    
  const postId = req.params.id
  
  const userId = req.body._id

  const {text} = req.body

  const post = await Post.findById(postId)

  if(!post)
  res.status(404).json({message:"POst not found"})


  if(!text)
  res.status(404).json({message:"text is required"})

  const comm = new Comment({userId,text,postId}).populate({
    path:'user',
    select:("-password")
  })

  await comm.save()

  if(comm){
     Post.comments.push(comm._id)
     await Post.save()
  }

  res.status(404).json({success:true,comm})

  } catch (error) {
    return res.status(500).json({message:error.message})
  }

}

export const getCommentsFromPost = async (req, res) => {

  try {
  const postId = req.params.id

  const comm = await Comment.find({post:postId}).populate("user","username","profilePicture")

  if(!comm) return res.status(404).json({success:false,message:"no comment found"})

  return res.status(200).json({success:true,comm})

  } catch (error) {
    return res.status(500).json({message:error.message}) 
  }

}

export const deletePost = async (req, res) => {

 try {
  const postId = req.params.id
  
  const userId = req.params._id

  const posts = await Post.findById(postId)
  if(!posts) return res.status(404).json({message:"no post found"})

  if(posts.user.toString() !== userId) return  res.status(404).json({success:true,message:"unothorized"})

  await Post.findByIdAndDelete(postId)

  const user = await User.findById(userId)

  await user.posts.pull(postId)

  await user.save()

  Comment.deleteMany({ post: postId })

  return res.status(200).json({success:true,message:"post deleted"})
 } catch (error) {
  return res.status(500).json({message:error.message})
 }



}

export const bookmarkPost = async (req, res) => {

  try {
    
    const postId = req.params.id
  
    const userId = req.params._id
    
    const posts = await Post.findById(postId)
    if(!posts) return res.status(404).json({message:"no post found"})

    const user = await User.findById(userId)
    if(!user) return res.status(404).json({message:"no user found"})

    const isBookedMark = user.bookmarks.includes(posts._id)

    if(!isBookedMark) {
      user.bookmarks.push(posts._id)
      await user.save()
      return res.status(201).json({success:true,message:"bookmarked successfully"})
    }else{
      user.bookmarks.pull(posts._id)
      await user.save()
      return res.status(200).json({success:true,message:"unbookmarked successfully"})
    }



  } catch (error) {
    return res.status(500).json({message:error.message})
  }

}

