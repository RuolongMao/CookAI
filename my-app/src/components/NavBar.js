import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/NavBar.css";

// 设置NavBar组件，接受方法和参数）
const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const navigate = useNavigate(); // 在 Navbar 中使用 useNavigate

  // 用户注销
  const handleLogout = () => {
    onLogout(); // 调用传递过来的 onLogout 函数
    navigate("/"); // 注销后跳转到首页
  };

  return (
    <nav className="navbar fixed-top navbar-expand-lg">
      <div className="container-fluid">
        {/* 第一列: 左边 */}
        <div className="col-4 nav-1">
          <div className="row">
            <div className="col text-center">
              <a onClick={() => navigate("/about")} className="about">
                About
              </a>
            </div>
            <div className="col text-center">
              <a  onClick={() => navigate("/community")} className="community">
                Community
              </a>
            </div>
            <div className="col text-center">
              <a onClick={() => navigate("/qa")} className="qa">
                Q&A
              </a>
            </div>
          </div>
        </div>

        {/* 中间列: 两行 */}
        <div className="col-4 text-center">
          <div className="row fork-pic">
            <a href="/" className="robot-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="rgb(255, 254, 245)"
                className="bi bi-robot"
                viewBox="0 0 16 16"
              >
                <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135" />
                <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5" />
              </svg>
            </a>
          </div>
          <div className="row">
            <a className="name" href="/">
              CHEFBOTX
            </a>
          </div>
        </div>

        {/* 第三列: 右边 */}
        <div className="col-4 text-right right-side">
          <div className="row">
            <div className="col-4 text-center">
              {isLoggedIn ? (
                <span className="wc-txt">Hello, {username}!</span>
              ) : (
                <span className="wc-txt">Hello, Guest!</span>
              )}
            </div>

            <div className="col-4 text-center">
              {isLoggedIn ? (
                <a onClick={() => navigate("/dashboard")} className="dashboard">
                  DashBoard
                </a>
              ) : (
                <Link to="/register" className="register">
                  Register
                </Link>
              )}
            </div>

            <div className="col-4 text-center most-right">
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
