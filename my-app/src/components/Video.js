// Video.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Video = () => {

    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate(-1); // Navigate to the video page when button is clicked
      };





  return (
    <div>
      <h1>啥都没有嘿嘿！！</h1>
      <div className="generate_video">
          <div className="generate_video_button" onClick={handleBackClick}>
            Back
          </div>
        </div>
    </div>
    
  );
};

export default Video;
