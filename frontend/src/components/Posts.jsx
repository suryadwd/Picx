import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts} = useSelector(store=>store.post);
  return (
    <div>
        {
          //login logout har account se kuch post banaye aurr ab chal rH h
            posts.map((post,index) => <Post key={post?._id||index} post={post}/>)
        }
    </div>
  )
}

export default Posts