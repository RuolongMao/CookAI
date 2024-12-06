



import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import loading from "../images/loading.gif";
import "../css/Loading.css";

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 从 location.state 中获取 prompt，如果没有则返回主页
  const prompt = location.state?.prompt || null;
  const hasFetchedRef = useRef(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    setIsEntering(true);
    if (!prompt) {
      navigate("/");
      return;
    }

    // 避免重复请求
    if (!hasFetchedRef.current && prompt) {
      hasFetchedRef.current = true;
      // 1. 请求AI生成菜谱
      fetch("https://cookai-55f9.onrender.com/query", {
        method: "POST",
        body: JSON.stringify({ prompt: prompt }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          // data 中包含 AI 生成的菜谱数据
          const { recipe_name, estimated_cost } = data.response;
          const { image_url } = data;
          
          // 2. 将结果存入数据库
          const body = {
            recipe_name: recipe_name,
            user_name: "tmp",
            image_url: image_url,
            details: data.response,
            est_cost: parseFloat(estimated_cost.slice(1)), // 去掉 '$'
            publish: 0,
          };

          const createResponse = await fetch("https://cookai-55f9.onrender.com/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (createResponse.ok) {
            // 3. 存入成功后跳转到 AIResponse 页面
            navigate(`/response/${recipe_name}`);
          } else {
            console.error("Failed to create recipe in DB");
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          navigate("/");
        });
    }
  }, [prompt, navigate]);

  return (
    <div className={`container loading-page mt-5 text-center ${isEntering ? 'fade-in' : ''}`}>
      <img src={loading} alt="cook" className="loading-img" />
      <p className="loading-text">
        <span className="scroll-content">Grabbing the freshest ingredients... just a moment!</span>
      </p>
    </div>
  );
};

export default Loading;
