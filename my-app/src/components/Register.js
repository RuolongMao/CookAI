import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 页面导航配置


// 设置Register组件，接受prop方法/参数：onRegisterSuccess，注册成功后通知父组件
const Register = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // 使用 useNavigate 来跳转页面，不要用useHistory！！已经过时了


  // 异步函数，阻止表单的默认提交行为（页面刷新）
  const handleRegister = async (e) => {
    e.preventDefault();


    // 发送POST请求到后端
    const response = await fetch('http://127.0.0.1:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), //请求体
    });

    // 检查响应是否成功
    if (response.ok) {
      const data = await response.json(); // 响应转换为JSON格式
      setMessage(data.message); // 设置注册成功后的提示消息（来自服务器）
      onRegisterSuccess(username); // 回掉父函数，通知注册成功，利用传入的方法
      navigate('/'); // 注册成功后跳转到 Chat 页面
    } else {
      const errorData = await response.json();
      setMessage(errorData.detail);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // 更新Username
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 更新Password
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
