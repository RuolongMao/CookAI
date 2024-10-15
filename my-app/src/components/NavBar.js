import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/NavBar.css";
import fork from "../images/fork.jpg";

// 设置NavBar组件，接受方法和参数）
const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const navigate = useNavigate(); // 在 Navbar 中使用 useNavigate

  // 用户注销
  const handleLogout = () => {
    onLogout(); // 调用传递过来的 onLogout 函数
    navigate("/"); // 注销后跳转到首页
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* 第一列: 左边 */}
        <div className="col-4 nav-1">
          <a href="" className="about">
            About
          </a>
          <a href="" className="community">
            Community
          </a>
          <a href="" className="qa">
            Q&A
          </a>
        </div>

        {/* 中间列: 两行 */}
        <div className="col-4 text-center">
          <div className="row fork-pic">
            <a href="#">
              <img src={fork} alt="fork-pic" />
            </a>
          </div>
          <div className="row">
            <a className="name" href="#">
              CHEFBOTX
            </a>
          </div>
          <div className="row">
            <hr className="line-break" />
          </div>
        </div>

        {/* 第三列: 右边 */}
        <div className="col-4 text-right right-side">
          <div className="row">
            <div className="col-4 text-end">
              {isLoggedIn ? (
                <span className="wc-txt">Hello, {username}!</span>
              ) : (
                <span className="wc-txt">Hello, Guest!</span>
              )}
            </div>

            <div className="col-4 text-end">
              {isLoggedIn ? (
                <span className="DashBoard">DashBoard</span>
              ) : (
                <Link to="/register" className="register">
                  Register
                </Link>
              )}
            </div>

            <div className="col-4 text-end most-right">
              {isLoggedIn ? (
                <span className="logout" onClick={handleLogout}>
                  Logout
                </span>
              ) : (
                <Link to="/signin" className="signin">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
