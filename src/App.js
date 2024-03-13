import './assets/global.scss';
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
import { Notifications } from 'react-push-notification';
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
      path: "/chats",
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
    <>
    <Notifications />
    <RouterProvider router={router} />
    </>
  );
}

export default App;
