import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "../main/Main";
import Home from "../home/home/Home";
import Register from "../register/Register";
import Login from "../login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element:<Home></Home>,
      },
      {
        path: "/registration",
        element:<Register></Register>,
      },
      {
        path: "/dashboard",
        element:<Login></Login>
      },
    ],
  },
]);

export default router;
