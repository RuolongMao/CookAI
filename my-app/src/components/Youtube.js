import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../css/Video.css"; // We can reuse the video CSS

const Youtube = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [recipeName, setRecipeName] = useState("");

  useEffect(() => {
    const fetchYoutubeVideos = async () => {
      try {
        const recipe = location.state?.response?.recipe_name;
        
        if (!recipe) {
          throw new Error("Recipe name not found. Please go back and try again.");
        }

        setRecipeName(recipe);
        
        const response = await fetch("http://127.0.0.1:8000/search_youtube", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipe_name: recipe,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch videos");
        }

        const data = await response.json();
        setVideos(data.videos);
        if (data.videos.length > 0) {
          setSelectedVideo(data.videos[0]);
        }
      } catch (err) {
        console.error("Video fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchYoutubeVideos();
  }, [location.state]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="video-container">
      <h1 className="video-title">
        {recipeName ? `${recipeName} Tutorials from YouTube` : 'Recipe Tutorials'}
      </h1>
      
      {isLoading && (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Searching for tutorial videos...</p>
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

      {!isLoading && !error && videos.length > 0 && (
        <div className="video-section">
          {/* Main Video Player */}
          <div className="main-video">
            {selectedVideo && (
              <iframe
                width="860"
                height="515"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="tutorial-video"
              ></iframe>
            )}
          </div>

          {/* Video List */}
          <div className="video-list">
            {videos.map((video) => (
              <div
                key={video.videoId}
                className={`video-item ${selectedVideo?.videoId === video.videoId ? 'selected' : ''}`}
                onClick={() => handleVideoSelect(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="video-thumbnail"
                />
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p>{video.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="video-controls">
            <button className="generate_video_button" onClick={handleBackClick}>
              Back to Recipe
            </button>
          </div>
        </div>
      )}

      {!isLoading && !error && videos.length === 0 && (
        <div className="no-videos-section">
          <p>No tutorial videos found for this recipe.</p>
          <button className="back-button" onClick={handleBackClick}>
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Youtube;