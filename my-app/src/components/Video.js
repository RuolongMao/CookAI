import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../css/Video.css";

const Video = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipeName, setRecipeName] = useState("");

  useEffect(() => {
    const generateVideo = async () => {
      try {
        const recipeSteps = location.state?.response?.steps;
        const recipeName = location.state?.response?.recipe_name;
        
        if (!recipeSteps || !Array.isArray(recipeSteps) || recipeSteps.length === 0) {
          throw new Error("Recipe steps not found. Please go back and try again.");
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

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="video-container">
      <div className="video-content">
        <h1 className="video-title">
          {recipeName ? `${recipeName} Tutorial` : 'Recipe Tutorial Video'}
        </h1>
        
        {isLoading && (
          <div className="loading-section">
            <div className="spinner"></div>
            <p>Generating your cooking tutorial video...</p>
            <p className="loading-subtext">This may take a few minutes</p>
          </div>
        )}

        {error && (
          <div className="error-section">
            <p className="error-message">Error: {error}</p>
            <button className="back-button" onClick={handleBackClick}>
              Go Back
            </button>
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
            <div className="video-controls">
              <button className="back-button" onClick={handleBackClick}>
                Back to Recipe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;