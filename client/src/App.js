import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./Root";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { UserContextProvider } from "./UserContext";
import CreatePage from "./pages/CreatePage";
import PostPage from "./pages/PostPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/create",
          element: <CreatePage />,
        },
        {
          path: "/post/:id",
          element: <PostPage />,
        }
      ],
    },
  ]);

  return (
    <>
      <UserContextProvider>
        <RouterProvider router={router}/>
      </UserContextProvider>
    </>
  );
}

export default App;
