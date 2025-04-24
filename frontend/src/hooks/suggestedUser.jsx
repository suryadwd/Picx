import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "@/redux/authSlice";


const SuggestedUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUser = async () => {
      try {
        const res = await axios.get("https://picx-kzg6.onrender.com/api/v1/user/suggested", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUser();
  }, [dispatch]);

  return null; // This component is only responsible for data fetching
};

export default SuggestedUser;



