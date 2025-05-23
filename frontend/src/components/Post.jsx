// import React, { useState } from "react";
// import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
// import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
// import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
// import { Button } from "./ui/button";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import CommentDialog from "./CommentDialog";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { toast } from "sonner";
// import { setPosts, setSelectedPost } from "@/redux/postSlice";
// import { Badge } from "./ui/badge";

// const Post = ({ post }) => {
//   const [com, setcom] = useState("");
//   const [toggle, setTogle] = useState(false);

//   const ChangeHandler = (e) => {
//     const inputText = e.target.value;
//     if (inputText.trim()) {
//       setcom(inputText);
//     } else {
//       setcom("");
//     }
//   };

//   const { posts } = useSelector((store) => store.post);
//   const { user } = useSelector((store) => store.auth);
//   const dispatch = useDispatch();

//   const postDeleteHandler = async () => {
//     try {
//       const res = await axios.delete(
//         `https://picx-kzg6.onrender.com/api/v1/post/delete/${post._id}`,
//         {
//           withCredentials: true,
//         }
//       );
      
      
      
//       if (res.data.success) toast.success(res.data.message);
//       const updatedPostData = posts.filter(
//         (postitems) => postitems._id !== post._id
//       );
//       dispatch(setPosts(updatedPostData));
//       setcom(false);
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response.data.message);
//     }
//   };

//   const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
//   const [postLike, setPostLike] = useState(post.likes.length);

//   const likeUnlikeHandler = async () => {
//     try {
//       const res = await axios.get(
//         `https://picx-kzg6.onrender.com/api/v1/post/like/${post._id}`,
//         { withCredentials: true }
//       );
//       if (res.data.success) {
//         const updatedLikes = liked ? postLike - 1 : postLike + 1;
//         setPostLike(updatedLikes);
//         setLiked(!liked);

//         // apne post ko update krunga
//         const updatedPostData = posts.map((p) =>
//           p._id === post._id
//             ? {
//                 ...p,
//                 likes: liked
//                   ? p.likes.filter((id) => id !== user._id)
//                   : [...p.likes, user._id],
//               }
//             : p
//         );
//         dispatch(setPosts(updatedPostData));
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [comment, setComment] = useState(post?.comments);

//   const commentHandler = async () => {
//     try {
//       const res = await axios.post(
//         `https://picx-kzg6.onrender.com/api/v1/post/comment/${post._id}`,
//         { text: com },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );
  
//       if (res.data.success) {
//         // Update local comment state
//         //yaha  [...comment, res.data.comm] last me comment add kr rha hau
//         const updatedCommentData = [...comment, res.data.comment];
//         setComment(updatedCommentData);
  
//         // Update Redux post state
//         const updatePostData = posts.map((item) =>
//           item._id === post._id
//             ? { ...item, comments: updatedCommentData }
//             : item
//         );
  
//         dispatch(setPosts(updatePostData));
//         toast.success(res.data.message);
//         setcom("");
//       }
//     } catch (error) {
//       console.log(error.message);
//       toast.error(
//         error.response?.data?.message
//       );
//     }
//   };
  

//   const bookmarkHandler = async () => {
//     try {
//         const res = await axios.get(`https://picx-kzg6.onrender.com/api/v1/post/bookmark/${post?._id}`, {withCredentials:true});
//         if(res.data.success){
//             toast.success(res.data.message);
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

//   return (
//     <div className="my-8 w-full max-w-sm mx-auto">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Avatar>
//             <AvatarImage
//               className="h-10 w-10 rounded-full"
//               src={post?.user?.profilePicture || ""}
//               alt="post_image"
//             />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//          <div className="flex gap-3 items-center">
//          <h1>{post?.user?.username || "this is manual username"}</h1>
//          { user?._id === post?.user?._id &&  <Badge  className=" m-1 text-xs">Me</Badge>}
//          </div>
//         </div>

//         <Dialog>
//           <DialogTrigger asChild>
//             <MoreHorizontal className="cursor-pointer" />
//           </DialogTrigger>
//           <DialogContent>
//             {
              
//               (user?._id !== post?.user?._id) &&( <Button variant="ghost" className="cursor-pointer w-full font-bold">
//               unfollow
//             </Button>)

//             }
//             <Button variant="ghost" className="cursor-pointer w-full font-bold">
//               Add to favourite
//             </Button>

//             {post?.user?.username === user?.username && (
//               <Button
//                 variant="ghost"
//                 className="cursor-pointer w-full font-bold"
//                 onClick={postDeleteHandler}
//               >
//                 Delete
//               </Button>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>

//       <img
//         className="rounded-sm my-2 w-full aspect-square object-cover"
//         src={post?.image || ""}
//         alt="post_img"
//       />

//       <div className="flex gap-60 my-3 ">
//         <div className="flex gap-3">
         
//           {liked ? (
//             <FaHeart
//               onClick={likeUnlikeHandler}
//               size={"22"}
//               className="cursor-pointer"
//             />
//           ) : (
//             <FaRegHeart
//               onClick={likeUnlikeHandler}
//               size={"22"}
//               className="cursor-pointer hover:text-gray-600"
//             />
//           )}

//           <MessageCircle
//             onClick={() =>{ 
//               setTogle(true)
//               dispatch(setSelectedPost(post))
//             }}
//             className="cursor-pointer hover:text-gray-500"
//             size={"22px"}
//           />
//           <Send className="cursor-pointer hover:text-gray-500" size={"22px"} />
//         </div>

//         <div className="flex ml-7">
//           <Bookmark
//           onClick={bookmarkHandler}
//             className="cursor-pointer hover:text-gray-500"
//             size={"22px"}
//           />
//         </div>
//       </div>

//       <span className="font-medium mb-2">{post?.likes?.length} likes</span>
//       <p>
//         <span className="font-medium mr-2">
//           {post?.user?.username || "manual ok"}
//         </span>
//         {post?.caption || "this is done by manually"}
//       </p>

//       {
//         comment.length > 0 && (<span
//           className="cursor-pointer text-gray-500"
//           onClick={() =>{ 
//             setTogle(true)
//             dispatch(setSelectedPost(post))
//           }}
//         >
//           View all {post?.comments?.length} comments
//         </span>)
//       }

//       <CommentDialog toggle={toggle} setToggle={setTogle} />

//       <div className="flex gap-20">
//         <input
//           type="text"
//           placeholder="Add a comment"
//           className="outline-none"
//           value={com}
//           onChange={ChangeHandler}
//         />
//         {com && <span onClick={commentHandler} className=" cursor-pointer ml-20 text-zinc-400">Post</span>}
//       </div>
//     </div>
//   );
// };

// export default Post;


import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [com, setcom] = useState("");
  const [toggle, setTogle] = useState(false);

  const ChangeHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setcom(inputText);
    } else {
      setcom("");
    }
  };

  const { posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const postDeleteHandler = async () => {
    try {
      const res = await axios.delete(
        `https://picx-kzg6.onrender.com/api/v1/post/delete/${post?._id}`,
        {
          withCredentials: true,
        }
      );
      
      if (res.data.success) toast.success(res.data.message);
      const updatedPostData = posts.filter(
        (postitems) => postitems._id !== post?._id
      );
      dispatch(setPosts(updatedPostData));
      setcom(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error deleting post");
    }
  };

  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post?.likes?.length || 0);

  const likeUnlikeHandler = async () => {
    try {
      const res = await axios.get(
        `https://picx-kzg6.onrender.com/api/v1/post/like/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // apne post ko update krunga
        const updatedPostData = posts.map((p) =>
          p._id === post?._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user?._id)
                  : [...p.likes, user?._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [comment, setComment] = useState(post?.comments || []);

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://picx-kzg6.onrender.com/api/v1/post/comment/${post?._id}`,
        { text: com },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      if (res.data.success) {
        // Update local comment state
        //yaha  [...comment, res.data.comm] last me comment add kr rha hau
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
  
        // Update Redux post state
        const updatePostData = posts.map((item) =>
          item._id === post?._id
            ? { ...item, comments: updatedCommentData }
            : item
        );
  
        dispatch(setPosts(updatePostData));
        toast.success(res.data.message);
        setcom("");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(
        error.response?.data?.message || "Error posting comment"
      );
    }
  };
  
  const bookmarkHandler = async () => {
    try {
        const res = await axios.get(`https://picx-kzg6.onrender.com/api/v1/post/bookmark/${post?._id}`, {withCredentials:true});
        if(res.data.success){
            toast.success(res.data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Error bookmarking post");
    }
  };

  // If post is null or undefined, show a loading state
  if (!post) {
    return <div className="my-8 w-full max-w-sm mx-auto">Loading post...</div>;
  }

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              className="h-10 w-10 rounded-full"
              src={post?.user?.profilePicture || ""}
              alt="post_image"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
         <div className="flex gap-3 items-center">
         <h1>{post?.user?.username || "this is manual username"}</h1>
         { user?._id === post?.user?._id &&  <Badge  className=" m-1 text-xs">Me</Badge>}
         </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            {
              (user?._id !== post?.user?._id) && (
                <Button variant="ghost" className="cursor-pointer w-full font-bold">
                  unfollow
                </Button>
              )
            }
            <Button variant="ghost" className="cursor-pointer w-full font-bold">
              Add to favourite
            </Button>

            {post?.user?.username === user?.username && (
              <Button
                variant="ghost"
                className="cursor-pointer w-full font-bold"
                onClick={postDeleteHandler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post?.image || ""}
        alt="post_img"
      />

      <div className="flex gap-60 my-3 ">
        <div className="flex gap-3">
         
          {liked ? (
            <FaHeart
              onClick={likeUnlikeHandler}
              size={"22"}
              className="cursor-pointer"
            />
          ) : (
            <FaRegHeart
              onClick={likeUnlikeHandler}
              size={"22"}
              className="cursor-pointer hover:text-gray-600"
            />
          )}

          <MessageCircle
            onClick={() =>{ 
              setTogle(true)
              dispatch(setSelectedPost(post))
            }}
            className="cursor-pointer hover:text-gray-500"
            size={"22px"}
          />
          <Send className="cursor-pointer hover:text-gray-500" size={"22px"} />
        </div>

        <div className="flex ml-7">
          <Bookmark
            onClick={bookmarkHandler}
            className="cursor-pointer hover:text-gray-500"
            size={"22px"}
          />
        </div>
      </div>

      <span className="font-medium mb-2">{post?.likes?.length || 0} likes</span>
      <p>
        <span className="font-medium mr-2">
          {post?.user?.username || "manual ok"}
        </span>
        {post?.caption || "this is done by manually"}
      </p>

      {
        comment?.length > 0 && (
          <span
            className="cursor-pointer text-gray-500"
            onClick={() =>{ 
              setTogle(true)
              dispatch(setSelectedPost(post))
            }}
          >
            View all {post?.comments?.length || 0} comments
          </span>
        )
      }

      <CommentDialog toggle={toggle} setToggle={setTogle} />

      <div className="flex gap-20">
        <input
          type="text"
          placeholder="Add a comment"
          className="outline-none"
          value={com}
          onChange={ChangeHandler}
        />
        {com && <span onClick={commentHandler} className="cursor-pointer ml-20 text-zinc-400">Post</span>}
      </div>
    </div>
  );
};

export default Post;