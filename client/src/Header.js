import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

const Header = () => {

  const {setUserInfo, userInfo} = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
      method: "GET",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  const logout = async () => {
    await fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });

    setUserInfo(null);
  };

  const username = userInfo?.username;

  return (
    <header>
      <Link to={"/"} className="logo">
        MyBlog
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create New Post</Link>
            <Link onClick={logout}>Logout</Link>
          </>
        )}

        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
