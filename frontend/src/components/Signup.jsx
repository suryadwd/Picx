import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
const Signup = () => {

  const[input, setInput] = useState({
    username:"",
    email:"",
    password:""
  })

  const navigate = useNavigate()

  const handelOnChange = (e) => {
    setInput({...input,  [e.target.name]: e.target.value})
  }

  const signupHandler = async (e) => {
    e.preventDefault()
    console.log(input)

    try {
      const res = await axios.post("https://picx-kzg6.onrender.com/api/v1/user/register",input,{
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      })

      if(res.data.success){
        navigate("/")
      toast.success(res.data.message)
      setInput({
        username:"",
        email:"",
        password:""
      })
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }

  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8 w-full max-w-sm">

        <div className="my-5 text-center">
          <h1 className="text-3xl font-bold">PicX</h1>
          <p className="text-sm text-gray-600">We welcome you all to share the memories of each of us.</p>
        </div>
        
        <div className="flex flex-col mb-4">
          <label htmlFor="username" className="text-left font-medium mb-2">Username</label>
          <Input
            name="username"
            value={input.username}
            type="text"
            onChange={handelOnChange}
            className="focus-visible:ring-transparent border p-2 rounded-md"
          />
        </div>
        
        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="text-left font-medium mb-2">Email</label>
          <Input
            name="email"
            value={input.email}
            type="email"
            onChange={handelOnChange}
            className="focus-visible:ring-transparent border p-2 rounded-md"
          />
        </div>
        
        <div className="flex flex-col mb-4">
          <label htmlFor="password" className="text-left font-medium mb-2">Password</label>
          <Input
            name="password"
            value={input.password}
            type="password"
            onChange={handelOnChange}
            className="focus-visible:ring-transparent border p-2 rounded-md"
          />
        </div>

      <Button type="submit">SignUp</Button>
        <span className="text-center">Already have an account? <Link to="/login" className="text-blue-400">Login</Link> </span>
      </form>
    </div>
  );
};

export default Signup;
