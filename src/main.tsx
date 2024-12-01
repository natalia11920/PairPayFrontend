import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import { disableCache } from "@iconify/react";

disableCache("all");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <NextUIProvider className="dark text-foreground bg-background">
      <RouterProvider router={router} />
    </NextUIProvider>
  </React.StrictMode>
);
