import logo from './logo.svg';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Auth from './pages/Auth';
import Chats from './pages/Chats';
import FriendRequsts from './pages/FriendRequests';
import Members from './pages/Members';
import Profile from './pages/Profile';
function App() {

  let con = true

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        con ? <Auth /> : <div>Who you</div>
      ),
    },
    {
      path: "/chat",
      element: (
        con ? <Chats /> : <div>Who you</div>
      ),
    },
    {
      path: "/frienRequests",
      element: (
        con ? <FriendRequsts /> : <div>Who you</div>
      ),
    },
    {
      path: "/members",
      element: (
        con ? <Members /> : <div>Who you</div>
      ),
    },
    {
      path: "/profile",
      element: (
        con ? <Profile /> : <div>Who you</div>
      ),
    },])
  return (
    <RouterProvider router={router} />
  );
}

export default App;
