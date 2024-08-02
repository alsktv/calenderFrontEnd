import { createBrowserRouter } from "react-router-dom"
//import Home from "./Routers/Home"
import NotFound from "./Routers/NotFound"
import FCalenderDateModal from "./Components/Home/CalenderDateModal";
//import Login from "./Routers/Login";
import React, { Suspense } from 'react';

const Home= React.lazy(() => import('./Routers/Home'));
const Login = React.lazy(() => import('./Routers/Login'));




const router = createBrowserRouter([
  {
    path:"",
    element : <Suspense fallback={<div>Loading...</div>}>
               <Login/>
              </Suspense>,
  },
  {
    path:"login",
    element : <Suspense fallback={<div>Loading...</div>}>
    <Login />
   </Suspense>,
  },
  {
    path:":userPk",
    element : <Suspense fallback={<div>Loading...</div>}>
    <Home />
   </Suspense>,
    
    children:[
      {
        path:":year/:month/:day",
        element:<FCalenderDateModal />
      }
    ]
  }
])

export default router