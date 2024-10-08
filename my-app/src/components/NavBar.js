import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


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
      <a className="navbar-brand" href="#">CookingAI</a>
      <div className="ml-auto">
        {isLoggedIn ? (
          <>
          <span className="navbar-text">Hello, {username}!</span>
          <button className="btn btn-link" onClick={handleLogout}>Logout</button>
          </>
        ) : (
            <>
            <span className="navbar-text">Hello, Guest!</span>
            <Link to="/register" className="btn btn-link">Register</Link>
            <Link to="/signin" className="btn btn-link">Sign In</Link>
            </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
