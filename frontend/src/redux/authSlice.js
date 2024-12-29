import { createSlice } from "@reduxjs/toolkit"



const authSlice = createSlice({
  name:"auth",
  initialState:{
    user:null,
    SuggestedUsers:[],
    userProfile:null,
  },

  reducers:{
    setAuthUser:(state,action) => {
      state.user = action.payload
    },
    setSuggestedUsers:(state,action) => {
      state.SuggestedUsers = action.payload
    },
    setUserProfile:(state,action) => {
      state.userProfile = action.payload
  }
}})

export const {setAuthUser, setSuggestedUsers, setUserProfile} = authSlice.actions
export default authSlice.reducer