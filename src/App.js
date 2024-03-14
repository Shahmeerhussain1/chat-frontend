import './assets/global.scss';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate ,
  Route,
  Link,
} from "react-router-dom";
import Auth from './pages/Auth';
import Chats from './pages/Chats';
import FriendRequsts from './pages/FriendRequests';
import Members from './pages/Members';
import Profile from './pages/Profile';
import { Notifications } from 'react-push-notification';
import { UserContext } from './components/contsxt';
import { useState } from 'react';
function App() {

  const [users , setUsers] = useState('')

  const Authorized = () =>{
   let user =  JSON.parse(localStorage.getItem('user'))
   return  user?._id ? true : false 
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        !Authorized() ? <Auth /> :  <Navigate to="/chats" />
      ),
    },
    {
      path: "/chats",
      element: (
        Authorized() || users ? <Chats /> : <Navigate to="/" />
      ),
    },
    {
      path: "/frienRequests",
      element: (
        Authorized() ? <FriendRequsts /> : <Navigate to="/" />
      ),
    },
    {
      path: "/members",
      element: (
        Authorized() ? <Members /> : <Navigate to="/" />
      ),
    },
    {
      path: "/profile",
      element: (
        Authorized() ? <Profile /> : <Navigate to="/" />
      ),
    },])
  return (
    <>
    <UserContext.Provider value={{users  ,setUsers}} >
    <Notifications />
    <RouterProvider router={router} />
    </UserContext.Provider>
    </>
  );
}

export default App;
