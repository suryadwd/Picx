import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ toggle, setToggle }) => {

  const [com, setcom] = useState("")

  //user ke info ke liye redux se
  const {user} = useSelector(store => store.auth)
   // post ke info ke liye
  const {posts} = useSelector(store => store.post)
  // kon sa post open hai
  const {SelectedPost} = useSelector(store => store.post)

  const dispatch = useDispatch()
  const [comment, setComment] = useState(SelectedPost?.comments);

  const inputHandler = (e) => {
        const inputText = e.target.value
        if(inputText.trim()){
          setcom(inputText)
        }else{
          setcom('')
        }
             
  }


  useEffect(() => {
    if (SelectedPost) {
      setComment(SelectedPost.comments);
    }
  }, [SelectedPost]);

  const sendCommenthandler = async () => {
    try {
      const res = await axios.post(
        `https://picx-kzg6.onrender.com/api/v1/post/comment/${SelectedPost._id}`,
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
          item._id === SelectedPost._id
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
        error.response?.data?.message
      );
    }
  };

  return (
    <div>
      <Dialog open={toggle}>
        <DialogContent
          onInteractOutside={() => setToggle(false)}
          className="max-w-3xl p-4"
        >
          <div className="flex flex-1 gap-6">
            <div className="w-1/2">
              <img
                className="w-full h-full object-cover rounded-lg"
                src={SelectedPost?.image}
                alt="comment_picture"
              />
            </div>

            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage src={SelectedPost?.user?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-bold text-sm">{SelectedPost?.user?.username}</Link>
                    <span className=" block text-gray-700 text-xs" >{SelectedPost?.user?.bio}</span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="ml-40 cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="text-center">
                    <div className="cursor-pointer text-red-600">Unfollow</div>
                    <div className="cursor-pointer">Go to post</div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr />

              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                {
                  comment?.map((comment) => <Comment key={comment._id} comment={comment} />)
                }
              
              </div>

              <div className="p-4 ">
                  <div className="flex gap-2 items-center">
                    <input type="text" onChange={inputHandler} placeholder="add comment" className="w-full outline-none border text-sm border-gray-300 p-2 rounded"/>
                    <Button onClick={sendCommenthandler} variant="outline">Send</Button>
                  </div>
              </div>

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentDialog;
