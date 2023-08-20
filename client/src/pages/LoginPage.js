import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  const login = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:4000/login", {
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("Wrong credentials");
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form action="" onSubmit={login} className="login">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button>Login</button>
    </form>
  );
};

export default LoginPage;
