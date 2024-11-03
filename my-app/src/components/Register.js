import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../css/Register.css";
import signpic from "../images/sign3.jpeg";

// 设置Register组件，接受prop方法/参数：onRegisterSuccess，注册成功后通知父组件
const Register = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const [recaptchaValue, setRecaptchaValue] = useState(null); // 新增状态变量
  const recaptchaRef = useRef(); // 用于重置 reCAPTCHA

  useEffect(() => {
    // 当组件加载时，设置为可见
    setIsVisible(true);
  }, []);

  const handleSignInNavigation = () => {
    navigate("/signin"); // 使用useNavigate跳转到SignIn页面
  };

  // 异步函数，阻止表单的默认提交行为（页面刷新）
  const handleRegister = async (e) => {
    e.preventDefault();

    // 检查是否有未填写的字段
    if (!username || !password || !confirmPassword) {
      setMessage("Please fill in all fields"); // 设置错误信息
      return; // 阻止表单提交
    }

    // 检查密码是否一致
    if (password !== confirmPassword) {
      setMessage("Passwords do not match"); // 设置错误信息
      // 清空密码输入框
      setPassword("");
      setConfirmPassword("");
      return; // 阻止表单提交
    }

    // 检查是否完成了 reCAPTCHA 验证
    if (!recaptchaValue) {
      setMessage("Please complete the verification");
      return;
    }

    // 发送POST请求到后端
    const response = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        recaptchaToken: recaptchaValue,
      }), //请求体
    });

    // 重置 reCAPTCHA
    recaptchaRef.current.reset();
    setRecaptchaValue(null);

    // 检查响应是否成功
    if (response.ok) {
      const data = await response.json(); // 响应转换为JSON格式
      setMessage(data.message); // 设置注册成功后的提示消息（来自服务器）
      onRegisterSuccess(username); // 回掉父函数，通知注册成功，利用传入的方法
      navigate(-1); // 注册成功后跳转到 Chat 页面
    } else {
      const errorData = await response.json();
      setMessage(errorData.detail);
    }
  };

  return (
    <div className="container-fluid father-part">
     
      {message && (
        <div class="alert alert-primary alrt-message" role="alert">
          {message}
        </div>
      )}

      <div className={`row register-table ${isVisible ? "visible" : ""}`}>
        <div className="col-6 left-side-r">
          <img src={signpic} alt="sign-pic" className="sign-pic"></img>
        </div>
        <div className="col-6 right-side-r">
          <p className="title-register text-center">Register</p>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="userName-r">Username</label>
              <input
                type="text"
                className="form-control input-r"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }} // 更新Username
                required
              />
            </div>
            <div className="form-group">
              <label className="passward-r">Password</label>
              <input
                type="password"
                className="form-control input-r"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage("");
                }} // 更新Password
                required
              />
            </div>
            <div className="form-group">
              <label className="confirm-password-r">Confirm Password</label>
              <input
                type="password"
                className="form-control input-r"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setMessage("");
                }} // 更新 confirmPassword
                required
              />
            </div>

            <div className="form-group recheck">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6Lc8TmwqAAAAAKm-H6hFjjbgZucAUhVOOD48tF1F"
                onChange={(value) => {
                  setRecaptchaValue(value);
                  setMessage("");
                }}
              />
            </div>

            <button type="submit" className="register-button">
              Register
            </button>
          </form>

          <div className="text-start mt-3">
            <p
              onClick={handleSignInNavigation}
              className="already-account-link"
            >
              Already had an account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
