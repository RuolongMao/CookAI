// Video.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Video = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateVideo = async () => {
      try {
        // Get recipe steps from previous page state
        const recipeSteps = location.state?.response?.steps;
        
        if (!recipeSteps) {
          throw new Error("No recipe steps found");
        }

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
          throw new Error("Failed to generate video");
        }

        const data = await response.json();
        setVideoUrl(`http://127.0.0.1:8000${data.video_url}`);
      } catch (err) {
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
        <h1 className="video-title">Recipe Tutorial Video</h1>
        
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

        {!isLoading && !error && videoUrl && (
          <div className="video-section">
            <video 
              controls 
              className="tutorial-video"
              poster="/api/placeholder/1280/720"
            >
              <source src={videoUrl} type="video/mp4" />
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

//   return (
//     <div>
//       <h1>啥都没有嘿嘿！！</h1>
//       <div className="generate_video">
//           <div className="generate_video_button" onClick={handleBackClick}>
//             Back
//           </div>
//         </div>
//     </div>
    
//   );
// };

export default Video;

