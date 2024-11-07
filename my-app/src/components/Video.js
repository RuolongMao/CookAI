import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Youtube from "./Youtube";
import "../css/Video.css";
import bk4 from "../images/bk4.jpg";
import bk5 from "../images/bk5.jpg";
import bk6 from "../images/bk6.jpg";
import bk7 from "../images/bk7.jpg";

const Video = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [recipeName, setRecipeName] = useState("");

  useEffect(() => {
    const generateVideo = async () => {
      setIsLoading(true);
      try {
        const recipeSteps = location.state?.response?.steps;
        const recipeName = location.state?.response?.recipe_name;

        if (
          !recipeSteps ||
          !Array.isArray(recipeSteps) ||
          recipeSteps.length === 0
        ) {
          throw new Error(
            "Recipe steps not found. Please go back and try again."
          );
        }

        setRecipeName(recipeName || "Recipe");

        const response = await fetch("http://127.0.0.1:8000/generate_video", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipe_steps: recipeSteps,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to generate video");
        }

        const data = await response.json();
        setVideoData(data.video_data);
      } catch (err) {
        console.error("Video generation error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    generateVideo();
  }, [location.state]);

  useEffect(() => {
    let interval;
    if (isLoading) {
      const totalTime = 120; // 预估总时间（秒）
      const increment = 100 / totalTime; // 每秒进度增量
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          const nextProgress = prevProgress + increment;
          if (nextProgress < 99) {
            return nextProgress;
          } else {
            clearInterval(interval);
            return 99; // 保持在99%，直到加载完成
          }
        });
      }, 1000); // 每秒更新一次
    } else {
      setProgress(100);
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="video-container">
      <Carousel interval={2000} pause={false}>
        <Carousel.Item>
          <img
            src={bk6}
            d-block
            w-100
            className="video-loading-pic"
            alt="First slide"
          />
        </Carousel.Item>
        {/* <Carousel.Item>
          <img
            src={bk4}
            d-block
            w-100
            className="video-loading-pic"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            src={bk5}
            d-block
            w-100
            className="video-loading-pic"
            alt="Third slide"
          />
        </Carousel.Item> */}
        <Carousel.Item>
          <img
            src={bk7}
            d-block
            w-100
            className="video-loading-pic"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>

      {isLoading && (
        <div className="loading-section">
          <div className="loading-section-title">
            <h1>Generating your AI cooking tutorial video...</h1>
          </div>

          {/* <p>{Math.round(progress)}% completed</p> */}
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <div>
            <Youtube />
          </div>
        </div>
      )}

      {error && (
        <div className="error-section">
          <p className="error-message">Error: {error}</p>
        </div>
      )}

      {!isLoading && !error && videoData && (
        <div className="video-section">
          <video
            controls
            className="tutorial-video"
            poster="/api/placeholder/1280/720"
          >
            <source
              src={`data:video/mp4;base64,${videoData}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          {/* <div className="video-controls">
            <button className="generate_video_button" onClick={handleBackClick}>
              Back to Recipe
            </button>
          </div> */}
        </div>
      )}

      <div className="back-recipe-btn">
        <button className="back-button" onClick={handleBackClick}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Video;