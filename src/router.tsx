import { createBrowserRouter } from "react-router-dom"
import Home from "./Routers/Home"
import NotFound from "./Routers/NotFound"
import FCalenderDateModal from "./Components/Home/CalenderDateModal";
import Login from "./Routers/Login";



const router = createBrowserRouter([
  {
    path:"",
    element: <Login />,
    errorElement:  <NotFound />,
  },
  {
    path:"login",
    element: <Login />,
    errorElement:  <NotFound />,
  },
  {
    path:":userPk",
    element:<Home />,
    errorElement:<NotFound />,
    children:[
      {
        path:":year/:month/:day",
        element:<FCalenderDateModal />
      }
    ]
  }
])

export default router