import React, { useEffect, useRef,useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import loading from "../images/loading.gif";
import "../css/Loading.css";

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 从 location.state 中获取传递的 prompt 信息
  const prompt = location.state?.prompt || null;
  const hasFetchedRef = useRef(false); // 使用 useRef 来跟踪请求状态
  const [isEntering, setIsEntering] = useState(false); 
  const username = localStorage.getItem("username");

  useEffect(() => {
    setIsEntering(true);
    if (!hasFetchedRef.current && prompt) {
      hasFetchedRef.current = true; // 标记请求已经发送
      fetch("https://cookai-55f9.onrender.com/query", {
        method: "POST",
        body: JSON.stringify({ prompt: prompt }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          navigate(`/response/${data.response.recipe_name}`, { state: { response: data.response, image_url: data.image_url, prompt: prompt, } });
          const body = {
            recipe_name: data.response.recipe_name,
            user_name: "tmp",
            image_url: data.image_url,
            details: data.response,
            est_cost: parseFloat(data.response.estimated_cost.slice(1)),
            publish: 0
          };
        
          fetch("http://127.0.0.1:8000/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          navigate("/");
        });
    } else if (!prompt) {
      navigate("/");
    }
  }, [prompt, navigate]);

  return (
    <div  className={`container loading-page mt-5 text-center ${isEntering ? 'fade-in' : ''}`}>
      {/* <img src="https://via.placeholder.com/150" alt="Loading" />  */}
      <img src={loading} alt="cook" className="loading-img"></img>
      <p className="loading-text">
        <span className="scroll-content">Grabbing the freshest ingredients... just a moment!</span>
      </p>
    </div>
  );
};

export default Loading;
