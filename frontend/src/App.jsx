import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import EditProfile from "./components/EditProfile";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from "./redux/chatSlice";
import { useEffect } from "react";
import ChatPage from "./components/ChatPage";
import ProtectedRoutes from "./components/ProtectRoute";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:  <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/',
        element:<ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: '/profile/:id',
        element:  <ProtectedRoutes> <Profile /></ProtectedRoutes>
      },
      {
        path: '/account/edit',
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: '/chat',
        element:  <ProtectedRoutes><ChatPage /></ProtectedRoutes>
      },

    ]
    },    
       
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },
 
])



function App() {
 
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('https://picx-kzg6.onrender.com', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      // listen all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

          

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);


  return (
    <>
      <RouterProvider router = {browserRouter} />
    </>
  )
}

export default App





