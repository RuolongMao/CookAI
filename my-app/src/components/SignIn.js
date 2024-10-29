import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import signpic from "../images/sign1.jpeg";
import "../css/SignIn.css";

const SignIn = ({ onSignInSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    // 当组件加载时，设置为可见
    setIsVisible(true);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    // 发送登录请求
    const response = await fetch("http://127.0.0.1:8000/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setMessage("Login successful");
      onSignInSuccess(username); // 通知父组件用户已登录
      navigate(-1); // 登录成功后跳转到 Chat 页面
    } else {
      const errorData = await response.json();
      setMessage(errorData.detail);
    }
  };

  return (
    <div className="container-fluid father-part">
      <div className={`row signIn-table ${isVisible ? "visible" : ""}`}>
        <div className="col-6 left-side-r">
          <img src={signpic} alt="sign-pic" className="sign-pic"></img>
        </div>

        <div className="col-6 right-side-r">
          <p className="title-signIn text-center">Sign In</p>
          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control input-r"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control input-r"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="signIn-button">
              Sign In
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
