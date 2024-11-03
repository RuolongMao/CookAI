import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../css/Youtube.css";

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
    // Smooth scroll to top when selecting a new video
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="video-container">
      <h1 className="video-title">
        {recipeName ? `${recipeName} Tutorials` : 'Recipe Tutorials'}
      </h1>
      
      {isLoading && (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Finding the best tutorials...</p>
        </div>
      )}

      {error && (
        <div className="error-section">
          <p className="error-message">{error}</p>
          <button className="back-button" onClick={handleBackClick}>
            Back to Recipe
          </button>
        </div>
      )}

      {!isLoading && !error && videos.length > 0 && (
        <>
          <div className="video-section">
            <div className="main-video">
              {selectedVideo && (
                <>
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="tutorial-video"
                  ></iframe>
                  <div className="main-video-info">
                    <h2 className="main-video-title">{selectedVideo.title}</h2>
                    <p className="main-video-channel">by {selectedVideo.channelTitle}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <h2 className="more-videos-title">More Tutorials</h2>
          
          <div className="video-list-container">
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
          </div>

          <div className="video-controls">
            <button className="back-button" onClick={handleBackClick}>
              Back to Recipe
            </button>
          </div>
        </>
      )}

      {!isLoading && !error && videos.length === 0 && (
        <div className="no-videos-section">
          <p>No tutorial videos found for this recipe.</p>
          <button className="back-button" onClick={handleBackClick}>
            Back to Recipe
          </button>
        </div>
      )}
    </div>
  );
};

export default Youtube;