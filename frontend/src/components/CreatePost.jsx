import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";


const CreatePost = ({ cre, setcre }) => {
  const imageRef = useRef(null);

  //user ke info ke liye redux se
  const {user} = useSelector(store => store.auth)
  // post ke info ke liye
  const {posts} = useSelector(store => store.post)

  const dispatch = useDispatch()

  const [cap, setcap] = useState("");
  const [file, setfile] = useState("");
  const [viewimg, setviewimage] = useState("");


  //copy from gpt
  const getImageUrl = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const fileHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setfile(file);
      const imgurl = await getImageUrl(file);
      setviewimage(imgurl);
    }
  };

  const createPostHandler = async (e) => {
   
    const data = new FormData()

    data.append("caption",cap)

    if(viewimg) data.append("image",file)
    
      try {
        
        const res = await axios.post("http://localhost:8000/api/v1/post/addpost",data, {
          headers:{
            'Content-Type':"multipart/form-data"
          },
          withCredentials:true
        }) 

          if(res.data.success){

            //i have to refresh the page againa an again so i just fetch the data again
            // and dispatch it to the post array in  poststore

            const updatedPosts = await axios.get("http://localhost:8000/api/v1/post/all", {
              withCredentials: true,
            });
            dispatch(setPosts(updatedPosts.data.posts));

            // dispatch(setPosts([res.data.posts,...posts]))
            toast.success(res.data.message)
            setcre(false)
          }

      } catch (error) {
        toast.error(error.response.data.message)
      }

  };

  return (
    <div>
      <Dialog open={cre}>
        <DialogContent onInteractOutside={() => setcre(false)}>
          <DialogHeader className="  text-center font-semibold">
          <DialogTitle className="mb-2">Create New Post</DialogTitle>
          
            <div className="flex gap-3 items-center">
              <Avatar>
                <AvatarImage src={user?.profilePicture || ""} alt="img" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div>
                <h1 className="font-semibold text-xs">{user?.username }</h1>
                <span className="text-gray-500 text-xs">{user?.bio}</span>
              </div>
            </div>
            <Textarea
            value={cap}
            onChange = { (e)  => setcap(e.target.value)}
              className="focus-visible:ring-transparent border-none"
              placeholder="write a caption..."
            />
            {viewimg && (
              <div className="w-full h-64 flex items-center justify-center">
                <img
                  src={viewimg}
                  alt="uploaded image"
                  className="object-cover h-full w-full"
                />
              </div>
            )}
            <input
              type="file"
              className="hidden mb-5"
              ref={imageRef}
              onChange={fileHandler}
            />
            <Button
              className="w-fit mx-auto bg-blue-500 hover:bg-blue-600 "
              onClick={() => imageRef.current.click()}
            >
              Select From Device
            </Button>
            {viewimg && (
              <Button type="button" onClick={createPostHandler} className="w-fit ml-48 ">
                Post
              </Button>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
