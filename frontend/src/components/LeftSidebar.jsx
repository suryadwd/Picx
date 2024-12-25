import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  Search,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const LeftSidebar = () => {
  const item = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "TrendingUp" },
    { icon: <MessageCircle />, text: "MessageCircle" },
    { icon: <Heart />, text: "Heart" },
    {
      icon: (
        <Avatar className="w-7 h-7">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />{" "}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
   
  ];

  const navigate = useNavigate()

  const logoutHandler = async () => {

    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout",{
        withCredentials:true
      })
      if(res.data.success){
        navigate("/login")
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }

  }

  const handelOnClick = (value) => {
      if(value === 'Logout') 
      logoutHandler()
  }

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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
