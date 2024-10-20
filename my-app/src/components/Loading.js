import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import loading from "../images/loading.gif";
import "../css/Loading.css";


const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 从 location.state 中获取传递的 prompt 信息
  const prompt = location.state?.prompt || null;


  const hasFetchedRef = useRef(false); // 使用 useRef 来跟踪请求状态

  useEffect(() => {
    if (!hasFetchedRef.current && prompt) {
      hasFetchedRef.current = true; // 标记请求已经发送
      fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        body: JSON.stringify({ prompt: prompt }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          navigate("/response", { state: { response: data.response, image_url: data.image_url  } });
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
    <div className="container mt-5 text-center">

      {/* <img src="https://via.placeholder.com/150" alt="Loading" />  */}
     <img src={loading} alt="cook" className="loading-img"></img>
     <div>Grabbing the freshest ingredients... just a moment!</div>
     
    </div>
  );
};

export default Loading;
