import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";


const Post = () => {

    const [com, setcom] = useState("")

    const ChangeHandler = (e) => {
      const inputText = e.target.value
      if(inputText.trim()){
        setcom(inputText)
      }else{
        setcom('')
      }
    }

    const [toggle, setTogle] = useState(false)

    const toggleHandler =  () => {
      setTogle( (prev) => !prev)
    }

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h3>username</h3>
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
            <Button variant="ghost" className="cursor-pointer w-full font-bold">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src="https://images.unsplash.com/photo-1592395940145-e2b7020d4148?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="post_img"
      />

      <div className="flex gap-60 my-3 ">
        <div className="flex gap-3">
          <FaRegHeart
            className="cursor-pointer hover:text-gray-500"
            size={"22px"}
          />
          <MessageCircle
              onClick={toggleHandler}
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

      <span className="font-medium mb-2">200 likes</span>
      <p>
        <span className="font-medium mr-2" >username</span>
        caption
      </p>

      <span className="cursor-pointer text-gray-500" onClick={toggleHandler}>View all 10 comments</span>

      <CommentDialog toggle={toggle} setToggle={setTogle} />

     <div className="flex gap-20">
     <input
       type="text" 
       placeholder="Add a comment"
       className="outline-none"
       value={com}
       onChange={ ChangeHandler}
       />    
      {
        com && <span className=" ml-20 text-zinc-400">Post</span>  
      }
     </div>

    </div>
  );
};

export default Post;
