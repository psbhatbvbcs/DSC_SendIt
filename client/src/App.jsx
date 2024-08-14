// inbuilt modules
import React, { useEffect } from "react";

import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import DashboardWithoutId from "./pages/DashboardWithoutId";

const supervisorRoutes = createBrowserRouter([
  {
    id: "layout",
    element: <Layout />,
    children: [
      {
        id: "dashboardWithoutId",
        path: "/",
        element: <DashboardWithoutId />,
        index: true,
      },
      {
        id: "dashboardWithId",
        path: "/:uniqueId",
        element: <Dashboard />,
        index: true,
      },
    ],
  },
  { path: "*", element: <div>Oops</div> },
]);

const App = () => {
  return <RouterProvider router={supervisorRoutes} />;
};

export default App;
