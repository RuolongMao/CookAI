import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/NavBar';
import Register from './components/Register';
import SignIn from './components/SignIn';
import Home from './components/Home';  // Home.js 替代 Chat.js

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');



  const handleRegisterSuccess = (newUsername) => {
    setIsLoggedIn(true);
    setUsername(newUsername);
  };

  const handleSignInSuccess = (newUsername) => {
    setIsLoggedIn(true);
    setUsername(newUsername);
  };

    // 注销逻辑
    const handleLogout = () => {
      setIsLoggedIn(false);
      setUsername('');  // 注销后跳转到首页
    };

  return (
    <Router>
      {/* Navbar will always be displayed */}
      <Navbar isLoggedIn={isLoggedIn} username={username}  onLogout={handleLogout} />
      
      <Routes>
        <Route path="/" element={<Home username={username} />} /> {/* Home 作为默认聊天页面 */}
        <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />
        <Route path="/signin" element={<SignIn onSignInSuccess={handleSignInSuccess} />} />
      </Routes>
    </Router>
  );
}

export default App;
