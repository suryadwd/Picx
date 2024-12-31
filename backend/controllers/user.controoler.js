import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookies } from "../utils/token.js"
import streamifier from "streamifier"
import cloudinary from "../config/cloudDb.js"

export const register = async (req, res)  => {

  try {
    
    const {email, password, username} = req.body

    if(!email || !password || !username) 
    return res.status(400).json({message:"all fields are requires"})

    const user = await  User.findOne({username})
    if(user) return res.status(400).json({message:"username is already taken"})

    const Existinguser = await User.findOne({email})

    if(Existinguser) return res.status(400).json({message:"email is register. Try login"})

    const hashPassword = await bcrypt.hash(password,10)

    const newUser = new User({email,username,password:hashPassword})

    await newUser.save()

    const payload = {
      _id:newUser._id,
      email:newUser.email,
      username:newUser.username
    }

    generateTokenAndSetCookies(payload,res)

    return res.status(201).json({success:true,message:"user created",data:newUser})


  } catch (error) {
    return res.status(500).json({message:error.message})
  }



}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) 
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not existing" });

    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck) return res.status(404).json({ message: "Password invalid" });

    // Populating posts and ensuring valid user reference
    const populatePost = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        
        // Check if post exists and user field is valid
        if (post && post.user && post.user.equals(user._id)) {
          return post;
        }
        return null; // If post is not valid or user is incorrect, return null
      })
    );

    // Filter out invalid (null) posts
    const validPosts = populatePost.filter((post) => post !== null);

    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      bio: user.bio,
      gender: user.gender,
      followers: user.followers,
      following: user.following,
      posts: validPosts,
    };

    generateTokenAndSetCookies(payload, res);

    return res.status(200).json({ success: true, message: "Logged in", user: payload });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};


export const logout = async (req, res) => {
  try {
    return res.cookie("jwt","",{maxAge:0}).status(200).json({success:true,message:"logged out successfully"})
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

export const getProfile = async (req, res) => {

  try {
    // const {username} = req.params
  const userId = req.params.id

  let user = await User.findById(userId).populate({path:"posts",createdAt:-1}).populate('bookmarks')

  if(!user)   return res.status(401).json({message:"user not found"})

  return res.status(200).json({success:true,user})
  } catch (error) {
  return res.status(500).json({message:error.message})
  }


}

export const editProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
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

      cloudResponse = await uploadStream(profilePicture.buffer); // Use buffer directly
    }

    const { bio, gender, username } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "user not found" });

    user.bio = bio || user.bio; // Preserve existing values if not provided
    user.gender = gender || user.gender; // Preserve existing values if not provided
    user.username = username || user.username; // Preserve existing values if not provided
    user.profilePicture = cloudResponse?.secure_url || user.profilePicture; // Update only if upload successful

    await user.save();

    return res.status(201).json({success:true ,message: "updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({_id:{$ne:req.user._id}}).select("-password");
    if(suggestedUsers.length === 0) return res.status(404).json({message:"no user exist"})
    return res.status(200).json({success:true, users:suggestedUsers}) 
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

export const follow = async (req, res) => {
  
  try {
    
    const {id:userId} = req.params

    const currentUserId = req.user._id
 
    const userToModify = await User.findById(userId)
    if(!userToModify) return res.status(404).json({message:"User to follow  not existing"})

    const currentUser = await User.findById(currentUserId)
    if(!currentUser) return res.status(404).json({message:"current user is not existing"})
    
    // if(userId === currentUserId.toString()) return res.json({message:"you cant follow yourself"})
    if(userId === currentUserId) return res.json({message:"you cant follow yourself"})

    
    const isFollowing = currentUser.following.includes(userToModify._id)

    if(!isFollowing){
      //push follower in userToModify
        await User.findByIdAndUpdate(userId,{$push:{followers:currentUserId}},{new:true})
      //push following in currentUser
        await User.findByIdAndUpdate(currentUserId,{$push:{following:userId}},{new:true})
        return res.status(200).json({message:"Following"})
    }else{
      //pull followe in userToModify
      await User.findByIdAndUpdate(userId,{$pull:{followers:currentUserId}},{new:true})
      //pull following in currentUser
      await User.findByIdAndUpdate(currentUserId,{$pull:{following:userId}},{new:true})
      return res.status(200).json({message:"Unfolowing"})
    }
    

  } catch (error) {
    return res.status(500).json({message:error.message})   
  }

}

