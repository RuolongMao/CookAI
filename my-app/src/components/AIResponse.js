import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AIResponse = () => {
  const navigate = useNavigate(); 
  const location = useLocation();  // 获取传递的状态

  // 从 location.state 中获取 response
  const response = location.state?.response || null;

  // 如果 response 不存在，则自动返回主页
  useEffect(() => {
    if (!response) {
      navigate('/');  // 如果没有 response，返回主页
    }
  }, [response, navigate]);

  // 确保 useEffect 只运行一次
//   useEffect(() => {
//     // 确保 response 存在，否则导航回首页
//     if (!response) {
//       navigate('/');
//     }
    // 依赖数组为空，确保只在组件挂载时运行一次
//   }, []);  // 这里确保 useEffect 只在组件挂载时运行一次，不会因 response 变化而重复调用

  // 如果 response 存在，显示它
  return (
    <div className="container mt-5">
      <h1 className="text-center">AI Generated Response</h1>
      {response ? (
        <div className="mt-4">
          <div className="p-3 border">
            <h2>Response</h2>
            <p>{response}</p>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AIResponse;
