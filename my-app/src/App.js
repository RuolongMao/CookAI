import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/NavBar';
import Register from './components/Register';
import SignIn from './components/SignIn';
import Home from './components/Home'; 
import AIResponse from './components/AIResponse';
import Loading from './components/Loading';
import Video from './components/Video';
import Community from "./components/Commnuity";
import About from "./components/About";
import Youtube from './components/Youtube';
import QandA from "./components/QandA";
import Dashboard from "./components/Dashboard";
import RecipeInstruction from './components/RecipeInstruction';
import NearbyStores from './components/NearbyStores';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    return savedLoginState ? JSON.parse(savedLoginState) : false;
  });
  
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  // Update localStorage whenever login state changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem('username', username);
  }, [isLoggedIn, username]);



  // 注册逻辑
  const handleRegisterSuccess = (newUsername) => {
    setIsLoggedIn(true); //设置登录状态
    setUsername(newUsername); //设置username （通过Register组件的回掉函数传入userName）
  };

  // 登录逻辑
  const handleSignInSuccess = (newUsername) => {
    setIsLoggedIn(true); //设置登录状态
    setUsername(newUsername); //设置username
  };

  // 注销逻辑
  const handleLogout = () => {
    setIsLoggedIn(false); // 登录状态设置为False
    setUsername('');  // 注销后跳转到首页
    // Clear localStorage on logout
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  return (
    <Router>
      {/* Navbar will always be displayed */}
      <Navbar isLoggedIn={isLoggedIn} username={username}  onLogout={handleLogout} />{/* 传递方法 & 传递方法*/}
      
      <Routes>
        <Route path="/" element={<Home username={username} />} /> {/* Home 作为默认聊天页面 */}
        <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />  {/* 传递方法*/}
        <Route path="/signin" element={<SignIn onSignInSuccess={handleSignInSuccess} />} /> {/* 传递方法*/}
        <Route path="/loading" element={<Loading />} />
        <Route path="/response" element={<AIResponse isLoggedIn={isLoggedIn} />} />
        <Route path="/video" element={<Video />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<About />} />
        <Route path="/youtube" element={<Youtube />} />
        <Route path="/qa" element={<QandA />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recipe/:recipe_name" element={<RecipeInstruction isLoggedIn={isLoggedIn} />} />
        <Route path="/nearby-stores" element={<NearbyStores />} />
      </Routes>
    </Router>
  );
}

export default App;
