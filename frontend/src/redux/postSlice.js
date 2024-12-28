import{ createSlice } from "@reduxjs/toolkit"

const postSlice = createSlice({
  name:'post',
  initialState:{
    posts:[],
    SelectedPost:null
  },
  reducers:{
    setPosts:(state, action) => {
      state.posts = action.payload
    },
    setSelectedPost:(state, action) => {
      state.SelectedPost = action.payload
    }
  }
})

export const {setPosts, setSelectedPost} = postSlice.actions

export default postSlice.reducer


