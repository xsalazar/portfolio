import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import App from "./app";
import Admin from "./Components/admin/admin";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  { path: "/admin", element: <Admin /> },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
