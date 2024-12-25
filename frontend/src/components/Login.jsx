import React from "react";
import { useState } from "react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handelOnChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    console.log(input);

    try {
      setLoading(true);

      if (!input.email || !input.password) {
        toast.error("Email and password are required");
        return;
      }
      

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        navigate("/")
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <form
        onSubmit={loginHandler}
        className="shadow-lg flex flex-col gap-5 p-8 w-full max-w-sm"
      >
        <div className="my-5 text-center">
          <h1 className="text-3xl font-bold">PicX</h1>
          <p className="text-sm text-gray-600">
            We welcome you all to share the memories of each of us.
          </p>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="text-left font-medium mb-2">
            Email
          </label>
          <Input
            name="email"
            value={input.email}
            type="email"
            onChange={handelOnChange}
            className="focus-visible:ring-transparent border p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="password" className="text-left font-medium mb-2">
            Password
          </label>
          <Input
            name="password"
            value={input.password}
            type="password"
            onChange={handelOnChange}
            className="focus-visible:ring-transparent border p-2 rounded-md"
          />
        </div>

        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> wait there
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}

        <span className="text-center">
          Doesn't have account{" "}
          <Link to="/signup" className="text-blue-500">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
