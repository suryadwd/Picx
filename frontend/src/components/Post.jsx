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
import { setPosts } from "@/redux/postSlice";

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
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) toast.success(res.data.message);
      const updatedPostData = posts.filter(
        (postitems) => postitems._id !== post._id
      );
      dispatch(setPosts(updatedPostData));
      setcom(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

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
          <h3>{post?.user?.username || "this is manual username"}</h3>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <Button variant="ghost" className="cursor-pointer w-full font-bold">
              unfollow
            </Button>
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
          <FaRegHeart
            className="cursor-pointer hover:text-gray-500"
            size={"22px"}
          />
          <MessageCircle
            onClick={() => setTogle(true)}
            className="cursor-pointer hover:text-gray-500"
            size={"22px"}
          />
          <Send className="cursor-pointer hover:text-gray-500" size={"22px"} />
        </div>

        <div className="flex ml-7">
          <Bookmark
            className="cursor-pointer hover:text-gray-500"
            size={"22px"}
          />
        </div>
      </div>

      <span className="font-medium mb-2">
        {post?.likes?.length || 69} likes
      </span>
      <p>
        <span className="font-medium mr-2">
          {post?.user?.username || "manual ok"}
        </span>
        {post?.caption || "this is done by manually"}
      </p>

      <span
        className="cursor-pointer text-gray-500"
        onClick={() => setTogle(true)}
      >
        View all {post?.comments?.length || 69} comments
      </span>

      <CommentDialog toggle={toggle} setToggle={setTogle} />

      <div className="flex gap-20">
        <input
          type="text"
          placeholder="Add a comment"
          className="outline-none"
          value={com}
          onChange={ChangeHandler}
        />
        {com && <span className=" ml-20 text-zinc-400">Post</span>}
      </div>
    </div>
  );
};

export default Post;
