import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 从 location.state 中获取传递的 prompt 信息
  const prompt = location.state?.prompt || null;

  useEffect(() => {
    if (prompt) {
      // 开始 AI 请求
      fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        body: JSON.stringify({ prompt: prompt }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // AI 请求完成后跳转到 AIResponse 页面，并传递生成的响应
          navigate("/response", { state: { response: data.response } });
        })
        .catch((error) => {
          console.error("Error:", error);
          // 处理错误后返回主页
          navigate("/");
        });
    } else {
      // 如果没有 prompt，直接返回主页
      navigate("/");
    }
  }, [prompt, navigate]);

  return (
    <div className="container mt-5 text-center">
      <h1>Generating AI Response...</h1>
      {/* <img src="https://via.placeholder.com/150" alt="Loading" />  */}
      <iframe
        src="https://giphy.com/embed/3o7bu8sRnYpTOG1p8k"
        width="480"
        height="480"
        style={{ border: 'none' }} // 去除默认边框
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen
        title="Loading animation"
      ></iframe>
      <p>
        <a href="https://giphy.com/gifs/pizza-loading-snacks-3o7bu8sRnYpTOG1p8k">
          via GIPHY
        </a>
      </p>
    </div>
  );
};

export default Loading;
