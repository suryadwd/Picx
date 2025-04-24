import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";

const SuggestedUsers = () => {
  const { SuggestedUsers, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loadingStates, setLoadingStates] = useState({});

  // Take only 6 users if more are returned
  const displayUsers = SuggestedUsers?.slice(0, 6) || [];

  const handleFollow = async (userId) => {
    if (!user?._id) {
      toast.error("Please login to follow users");
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, [userId]: true }));

      const res = await axios({
        method: "post",
        url: `https://picx-kzg6.onrender.com/api/v1/user/follow/${userId}`,
        data: {},
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        credentials: "include",
      });

      if (res.data) {
        // Initialize following array if it doesn't exist
        const currentFollowing = user.following || [];
        const isCurrentlyFollowing = currentFollowing.includes(userId);

        const updatedUser = {
          ...user,
          following: isCurrentlyFollowing
            ? currentFollowing.filter((id) => id !== userId)
            : [...currentFollowing, userId],
        };

        dispatch(setAuthUser(updatedUser));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Follow error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login again to follow users");
      } else if (error.code === "ERR_NETWORK") {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to follow user. Please try again."
        );
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const isFollowing = (userId) => {
    if (!user?.following) return false;
    return user.following.includes(userId);
  };

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      <div className="space-y-4">
        {displayUsers.map((suggestedUser) => (
          <div
            key={suggestedUser._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${suggestedUser?._id}`}>
                <Avatar>
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    alt={suggestedUser?.username}
                  />
                  <AvatarFallback>
                    {suggestedUser?.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${suggestedUser?._id}`}>
                    {suggestedUser?.username}
                  </Link>
                </h1>
                <span className="text-gray-600 text-xs line-clamp-1">
                  {suggestedUser?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleFollow(suggestedUser._id)}
              disabled={loadingStates[suggestedUser._id]}
              className={`text-xs font-bold px-4 py-1 rounded-md transition-colors
                ${
                  isFollowing(suggestedUser._id)
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    : "bg-blue-50 text-[#3BADF8] hover:bg-blue-100"
                }
                ${
                  loadingStates[suggestedUser._id]
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
            >
              {loadingStates[suggestedUser._id]
                ? "Loading..."
                : isFollowing(suggestedUser._id)
                ? "Unfollow"
                : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
