import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";

const CommentDialog = ({ toggle, setToggle }) => {

  const [com, setcom] = useState("")

  //user ke info ke liye redux se
  const {user} = useSelector(store => store.auth)
   // post ke info ke liye
  const {posts} = useSelector(store => store.post)

  const inputHandler = (e) => {
        const inputText = e.target.value
        if(inputText.trim()){
          setcom(inputText)
        }else{
          setcom('')
        }
  }

  const sendCommenthandler = () => {
    console.log("click")
  }

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
                src="https://images.unsplash.com/photo-1486941976652-a3b72da83237?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="comment_picture"
              />
            </div>

            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-bold text-sm">{user.username}</Link>
                    <span className=" block text-gray-700 text-xs" >{user.bio}</span>
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
                aurr comments load hoge ab
              </div>

              <div className="p-4 ">
                  <div className="flex gap-2 items-center">
                    <input type="text" onClick={inputHandler} placeholder="add comment" className="w-full outline-none border border-gray-300 p-2 rounded"/>
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
