import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/NavBar.css"
import fork from "../images/fork.jpg"


// 设置NavBar组件，接受方法和参数）
const Navbar = ({ isLoggedIn, username, onLogout }) => { 


  const navigate = useNavigate();  // 在 Navbar 中使用 useNavigate

  // 用户注销
  const handleLogout = () => {
    onLogout();  // 调用传递过来的 onLogout 函数
    navigate('/');  // 注销后跳转到首页
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* 第一列: 左边 */}
        <div className="col">

          <div>1</div>
          <div>2</div>
          <div>3</div>
        </div>

        {/* 中间列: 两行 */}
        <div className="col text-center">
          <div className="row fork-pic">
            <a href="#">
            <img src={fork} alt="fork-pic"/>
            </a>
            
          </div>
          <div className="row">
           <a className="name" href="#">
            CHEFBOTX
           </a>
          </div>
        </div>

        {/* 第三列: 右边 */}
        <div className="col text-right">

        {isLoggedIn ? (
              <>
                <span className="navbar-text">Hello, {username}!</span>
              </>
            ) : (
              <>
                <span className="navbar-text">Hello, Guest!</span>
              </>
            )}



          {isLoggedIn ? (
            <>
              <button className="btn btn-link" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-link">Register</Link>
              <Link to="/signin" className="btn btn-link">Sign In</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
