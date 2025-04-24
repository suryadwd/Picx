import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import streamifier from "streamifier"
import Comment from "../models/comment.model.js"
import cloudinary from "../config/cloudDb.js"
import { getReceiverSocketId } from "../socket/socket.js"

export const createPost = async (req, res) => {

  try {
    
    const userId = req.user._id

    console.log(userId)

    const image = req.file
  
    const caption = req.body.caption
  
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
    
          cloudResponse = await uploadStream(image.buffer); 
        }
  
    const user = await User.findById(userId)
    
    if(!user) return res.status(401).json({Message:"user not found"})
  
    const post = new Post({user:userId,image:cloudResponse.secure_url,caption})
  
    await post.save()

    if(user){
      user.posts.push(post._id)
      await user.save()
    }

    await post.populate({path:'user',select:"-password"})
    
    return res.status(201).json({success:true,message:"post created",post})

  } catch (error) {
    return res.status(500).json({message:error.message}) 
  }

}

export const getAllPost = async (req, res) => {
  try {
      const posts = await Post.find().sort({ createdAt: -1 })
          .populate({ path: 'user', select: 'username profilePicture' })
          .populate({
              path: 'comments',
              sort: { createdAt: -1 },
              populate: {
                  path: 'user',
                  select: ' username profilePicture'
              }
          });
      return res.status(200).json({
          posts,
          success: true
      })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
}

};

export const getUserPost = async (req, res) => {
  try {
    const userId = req.user._id; 
    
    const posts = await Post.find({ user: userId }) 
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        select: "username profilePicture", 
      });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const likeUnlike = async (req, res) => {
  try {
    
    const userId = req.user._id

    const {id:postId} = req.params

    const post = await Post.findById(postId)

    if(!post) return res.status(404).json({message:"no post found"})

    const isLike = await post.likes.includes(userId)

    if(!isLike){
      const updatedPost = await Post.findByIdAndUpdate(postId,{$push:{likes:userId}},{new:true})
      return res.status(201).json({success:true,message:"You liked" , updatedPost})
    }else{
      const updatedPost = await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}},{new:true})
      return res.status(201).json({success:true,message:"You dislikes" , updatedPost}) 
    }

    const user = await User.findById(userId).select('username profilePicture')
    const postOwnerId = post.user.toString()

    if(postOwnerId !== userId){{
      const notification = {
        userId:userId,
        postId:postOwnerId,
        type:"like",
        message:`check this`,
      }

      const postOwnerSocketId = getReceiverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit('newNotification',notification)

      }
    }

  } catch (error) {
        return res.status(500).json({message:error.message})
  }
}

export const addComment = async (req, res) => {

  try {
    
  const postId = req.params.id
  
  const userId = req.user._id

  const {text} = req.body

  
  if (!postId) {
    return res.status(400).json({ message: 'Missing postId' });
  }

  if ( !userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  if ( !text) {
    return res.status(400).json({ message: 'Missing text' });
  }

  const post = await Post.findById(postId)
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const newComment = new Comment({ user:userId, text, post:postId });
  await newComment.save();


  await newComment.populate({ path: 'user', select: '-password' });

  post.comments.push(newComment._id);
    await post.save();

    res.status(200).json({ success: true, comment: newComment, message: 'Comment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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

 
export const deletePost = async (req,res) => {
  try {
      const postId = req.params.id;
      const userId = req.user._id;

      // console.log("post Id",postId);
      // console.log("user Id",userId);

      const post = await Post.findById(postId);
      if(!post) return res.status(404).json({message:'Post not found', success:false});

      

      // delete post
      await Post.findByIdAndDelete(postId);

      // remove the post id from the user's post
      let user = await User.findById(userId);
      user.posts = user.posts.filter(id => id.toString() !== postId);
      await user.save();

      // delete associated comments
      await Comment.deleteMany({post:postId});

      return res.status(200).json({
          success:true,
          message:'Post deleted'
      })

  } catch (error) {
      console.log(error);
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

// export const bookmarkPost = async (req,res) => {
//   try {
//       const postId = req.params.id;
//       const authorId = req.id;
//       const post = await Post.findById(postId);
//       if(!post) return res.status(404).json({message:'Post not found', success:false});
      
//       const user = await User.findById(authorId);
//       if(user.bookmarks.includes(post._id)){
//           // already bookmarked -> remove from the bookmark
//           await user.updateOne({$pull:{bookmarks:post._id}});
//           await user.save();
//           return res.status(200).json({type:'unsaved', message:'Post removed from bookmark', success:true});

//       }else{
//           // bookmark krna pdega
//           await user.updateOne({$addToSet:{bookmarks:post._id}});
//           await user.save();
//           return res.status(200).json({type:'saved', message:'Post bookmarked', success:true});
//       }

//   } catch (error) {
//       console.log(error);
//   }
// }