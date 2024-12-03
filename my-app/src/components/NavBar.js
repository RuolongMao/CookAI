import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/NavBar.css";

// 设置NavBar组件，接受方法和参数）
const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const navigate = useNavigate(); // 在 Navbar 中使用 useNavigate
  const location = useLocation(); 


  const isHomePage = location.pathname === "/";
  // 用户注销
  const handleLogout = () => {
    onLogout(); // 调用传递过来的 onLogout 函数
    navigate("/"); // 注销后跳转到首页
  };

  return (
    <nav
    className={`navbar fixed-top navbar-expand-lg ${
      isHomePage ? "navbar-home" : "navbar-other"
    }`}
  >
      <div className="container-fluid">
        {/* 第一列: 左边 */}
        <div className="col-4 text-start">
          <div className="row fork-pic">
            <a href="/" className="robot-icon">
            </a>
          </div>
          <div className="row">
            <a className="name" href="/">
              CHEFBOTX
            </a>
          </div>
        </div>



        {/* 中间列: 两行 */}
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


        {/* 第三列: 右边 */}
        {/* <div className="col-4 text-right right-side">
          <div className="row">
            <div className="col-4 text-center">
              {isLoggedIn ? (
                <span className="wc-txt">Hello, {username}!</span>
              ) : (
                <span className="wc-txt"></span>
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
        </div> */}
         {/* 右边 */}
         <div className="col-4 text-right right-side">
          {isLoggedIn ? (
            <div className="row justify-content-end">
            <div className="dropdown text-center nav-reg-sig1">
              {/* Hello */}
              <span className="wc-txt">Hello, {username}</span>
              {/* Dropdown Icon */}
              <button
                className="btn dropdown-toggle nav-reg-sig1"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  background: "none",
                  border: "none",
                  boxShadow: "none",
                  
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-list"
                  viewBox="0 0 16 16"
                 
                >
                  <path
                    fillRule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                  />
                </svg>
              </button>
              {/* Dropdown Menu */}
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
            </div>
          ) : (
            // 未登录状态
            <div className="row justify-content-end">
              <div className="col-6 text-end nav-reg-sig">
                <Link 
                  to="/register" 
                  state={{ from: location.pathname }} 
                  className="register"
                >
                  Register
                </Link>
              </div>
              <div className="col-6 text-end nav-reg-sig">
                <Link 
                  to="/signin" 
                  state={{ from: location.pathname }}
                  className="signin"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>








      </div>
    </nav>
  );
};

export default Navbar;
