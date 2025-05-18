import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Header from "./components/header.tsx";
import FooterSection from "./components/footer.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import AuthPage from "./pages/auth.tsx";
import UserConsole from "./pages/console.tsx";
import UserProvider from "./context/user.context.tsx";

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/console",
    Component: UserConsole,
  },
  {
    path: "/auth",
    Component: AuthPage,
  },
]);
createRoot(document.getElementById("root")!).render(
  
  <UserProvider>
    <Header />
    <RouterProvider router={router} />
    <FooterSection />
    <Toaster />
  </UserProvider>
);
