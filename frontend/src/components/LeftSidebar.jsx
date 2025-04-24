import {
  CreativeCommons,
  CreativeCommonsIcon,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";

const LeftSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const item = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Message" },
    // { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-7 h-7">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />{" "}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get("https://picx-kzg6.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const [cre, setcre] = useState(false);

  const createStaticHandler = async () => {
    setcre(true);
  };

  const handelOnClick = (value) => {
    if (value === "Logout") logoutHandler();
    if (value === "Create") createStaticHandler();
    if(value === "Profile") navigate(`/profile/${user?._id}`)
    if(value === "Home") navigate('/')
    if(value === "Message") navigate('/chat')
  };

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">PicX</h1>

        <div>
          {item.map((items, index) => {
            return (
              <div
                onClick={() => handelOnClick(items.text)}
                key={index}
                className="flex items-center gap-4 relative hover:bg-gray-400 cursor-pointer rounded-lg p-3 my-2"
              >
                {items.icon}
                <span>{items.text}</span>

                  {/* added btween */}


                    
                  {/* this */}

              </div>
            );
          })}
        </div>
      </div>

      <CreatePost cre={cre} setcre={setcre} />
    </div>
  );
};

export default LeftSidebar;
