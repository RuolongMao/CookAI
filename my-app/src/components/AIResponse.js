import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip } from "bootstrap";
import "../css/AiReponse.css";

const AIResponse = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const response = location.state?.response || null;
  const imageUrl = location.state?.image_url || null;
  const prompt = location.state?.prompt || null;

  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [liked, setLiked] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // 提示信息状态
  const [showAlert, setShowAlert] = useState(false); // 控制 alert 显示状态
  const username = localStorage.getItem("username");

  const [showShareDialog, setShowShareDialog] = useState(false);

  // 如果 response 不存在，则自动返回主页
  useEffect(() => {
    if (!response) {
      navigate("/"); // 如果没有 response，返回主页
    }
    console.log("AI Response: ", response);
    console.log("img", imageUrl);
    console.log("Prompt: ", prompt);
  }, [response, imageUrl, prompt, navigate]);

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new Tooltip(tooltipTriggerEl);
  });
  // 解析 response 中的内容
  const {
    recipe_name,
    nutrition_facts,
    ingredients,
    steps,
    estimated_cost,
    estimate_time,
  } = response || {};

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);

    // Hide the alert after 3 seconds
    setTimeout(() => {
      const alertElement = document.querySelector(".alert");
      if (alertElement) {
        alertElement.classList.add("alert-exit");

        // Remove the alert from DOM after animation
        setTimeout(() => {
          setShowAlert(false);
        }, 300); // Match this with the animation duration
      }
    }, 2000);
  };

  // 分享功能
  const handleShare = async () => {
    const shareData = {
      title: recipe_name || "Check out this recipe!",
      text: `Here's a recipe you might enjoy: ${recipe_name}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showAlertMessage("Recipe shared successfully!");
      } else {
        showAlertMessage("Sharing is not supported on this device.");
      }
    } catch (err) {
      showAlertMessage("Failed to share the recipe.");
      console.error("Error sharing:", err);
    }
  };

  // 处理重新生成
  const handleRegenerate = () => {
    if (!prompt) {
      console.error("No prompt available to regenerate.");
      return;
    }
    // 导航到 Loading 页面，并传递 prompt
    navigate("/loading", { state: { prompt: prompt } });
  };

  // 处理复选框勾选
  const handleCheckboxChange = (index) => {
    setCheckedIngredients((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // 切换勾选状态
    }));
  };

  // 处理点赞功能
  const handleToggleLike = () => {
    if (!isLoggedIn) {
      // 如果用户未登录，跳转到登录页面
      navigate("/signin");
      return;
    }

    const newLikedState = !liked;

    if (newLikedState) {
      // 用户想要点赞食谱，显示分享对话框
      setShowShareDialog(true);
    } else {
      // 用户取消点赞
      setLiked(newLikedState);
      handleUnlikeRecipe();
    }
  };

  const handleUnlikeRecipe = async () => {
    showAlertMessage("You have unliked this recipe!");
    await fetch("https://cookai-55f9.onrender.com/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipe_name: recipe_name }),
    });
  };

  const handleShareYes = async () => {
    setLiked(true);
    setShowShareDialog(false);

    const body = {
      recipe_name: recipe_name,
      user_name: username,
      image_url: imageUrl,
      details: response,
      est_cost: parseFloat(estimated_cost.slice(1))
    };

    try {
      await fetch("https://cookai-55f9.onrender.com/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      await fetch("https://cookai-55f9.onrender.com/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipe_name: recipe_name }),
      });

      showAlertMessage(
        "Recipe saved to your favorites and shared successfully!"
      );
    } catch (error) {
      showAlertMessage("Failed to share recipe.");
      console.error("Error sharing recipe:", error);
    }
  };

  const handleShareNo = async () => {
    setLiked(true);
    setShowShareDialog(false);

    const body = {
      recipe_name: recipe_name,
      user_name: username,
      image_url: imageUrl,
      details: response,
      est_cost: parseFloat(estimated_cost.slice(1))
    };

    try {
      await fetch("https://cookai-55f9.onrender.com/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      showAlertMessage("Recipe saved to your favorites!");
    } catch (error) {
      showAlertMessage("Failed to save recipe.");
      console.error("Error saving recipe:", error);
    }
  };

  const handleGenerateClick = () => {
    // Check if response exists and contains required data
    if (!response || !response.recipe_name || !response.steps) {
      console.error("Missing required recipe data");
      return;
    }

    // Pass the recipe data to the video page
    navigate("/video", {
      state: {
        response: {
          recipe_name: response.recipe_name,
          steps: response.steps,
        },
      },
    });
  };

  // const handleYoutubeClick = () => {
  //   navigate("/youtube", { state: { response } }); // Navigate to the YouTube page
  // };

  // 如果 response 存在，显示它
  return (
    <div className="container--fluid">
      {showAlert && (
        <div className="alert-container">
          <div className="alert">
            <p className="alert-message">{alertMessage}</p>
          </div>
        </div>
      )}

      {showShareDialog && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            // Only close if clicking the overlay, not the modal content
            if (e.target === e.currentTarget) {
              setShowShareDialog(false);
            }
          }}
        >
          <div className="modal-container">
            <div className="modal-header head-text-share">
              <p className="head-text">Share Recipe</p>
              <button
                className="modal-close"
                onClick={() => setShowShareDialog(false)}
              ></button>
            </div>

            <div className="modal-content">
              <div className="modal-message message">
                <p>
                  Would you like to share this recipe with others in our
                  community?
                </p>
              </div>

              <div className="modal-buttons">
                <button
                  className="modal-button confirm-button"
                  onClick={handleShareYes}
                >
                  Yes, Share and Save
                </button>
                <button
                  className="modal-button cancel-button"
                  onClick={handleShareNo}
                >
                  No, Just Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row image-part">
        <div className="col-10 image-left-part">
          {imageUrl && (
            <img src={imageUrl} alt="Generated Recipe" className="image" />
          )}
        </div>

        <div className="col-2 like-right-part">
          <div className="row button-part">
            <div className="col-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="refresh-button bi bi-arrow-clockwise"
                fill="currentColor"
                viewBox="0 0 16 16"
                onClick={handleRegenerate}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Regenerate"
                style={{ cursor: "pointer" }}
              >
                <path
                  fill-rule="evenodd"
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
              </svg>
            </div>

            <div className="col-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`heart-icon ${liked ? "liked" : ""}`}
                viewBox="-1 -1 18 16"
                onClick={handleToggleLike}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Like"
                style={{ cursor: "pointer" }}
              >
                <path
                  fillRule="evenodd"
                  stroke={liked ? "black" : "black"}
                  strokeWidth={liked ? "0.7" : "1"}
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                />
              </svg>
            </div>

            <div className="col-auto share-part">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-share-fill share-button"
                viewBox="0 0 16 16"
                onClick={handleShare}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Share"
                style={{ cursor: "pointer" }}
              >
                <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="row recipe_name-part">
        {recipe_name && (
          <p className="recipe_name text-center">{recipe_name.toUpperCase()}</p>
        )}
      </div>

      <div className="row section1">
        <div className="col ingredients-part">
          <h2>Ingredients</h2>
          <div className="ingredients-list">
            {ingredients && ingredients.length > 0 ? (
              <ul>
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    {/* 添加复选框 */}
                    <div className="form-check d-flex justify-content-between align-items-center">
                      <div>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id={`ingredient-checkbox-${index}`}
                          checked={checkedIngredients[index] || false}
                          onChange={() => handleCheckboxChange(index)}
                        />
                        <label
                          className={`form-check-label ${
                            checkedIngredients[index]
                              ? "text-decoration-line-through"
                              : ""
                          }`}
                          htmlFor={`ingredient-checkbox-${index}`}
                        >
                          <span className="ingredient-name">
                            {ingredient.name}
                          </span>
                        </label>
                      </div>
                      <div>
                        <label
                          className={`form-check-label ${
                            checkedIngredients[index]
                              ? "text-decoration-line-through"
                              : ""
                          }`}
                          htmlFor={`ingredient-checkbox-${index}`}
                        >
                          <span className="ingredient-info">
                            {ingredient.quantity} ({ingredient.cost})
                          </span>
                        </label>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ingredients provided.</p>
            )}
          </div>
        </div>

        <div className="col estimate">
          <div className="row cost">
            <div className="cost-name">
              <h2>Estimated Total Cost</h2>
            </div>
            <div className="estimate-cost">
              <p>{estimated_cost}</p>
            </div>
          </div>

          <div className="row time1">
            <div className="time-name">
              <h2>Estimated Time</h2>
            </div>
            <div className="estimate-time">
              <p>{estimate_time}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row steps-part">
        <h2>Steps</h2>
        {steps && steps.length > 0 ? (
          <ol>
            {steps.map((step, index) => (
              <li key={index}>
                <strong>{step.explanation}</strong> - {step.instruction}
              </li>
            ))}
          </ol>
        ) : (
          <p>No steps provided.</p>
        )}

        <div className="generate_video">
          <div className="generate_video_button" onClick={handleGenerateClick}>
            Click here for Video
          </div>
        </div>
        {/* <div className="generate_video">
          <div className="generate_video_button" onClick={handleYoutubeClick}>
            Find Youtube Tutorials
          </div>
        </div> */}
      </div>

      <div className="row nutrition-part">
        <h2>Nutrition</h2>
        {nutrition_facts && (
          <div className="row justify-content-center nutrition-section">
            <div className="col-auto">
              <div className="nutrition-card">
                <div className="card-circle">{nutrition_facts.calories}</div>
                <div className="card-name">Calories</div>
              </div>
            </div>
            <div className="col-auto">
              <div className="nutrition-card">
                <div className="card-circle">{nutrition_facts.fiber}g</div>
                <div className="card-name">Fiber</div>
              </div>
            </div>

            <div className="col-auto">
              <div className="nutrition-card">
                <div className="card-circle">{nutrition_facts.protein}g</div>
                <div className="card-name">Protein</div>
              </div>
            </div>

            <div className="col-auto">
              <div className="nutrition-card">
                <div className="card-circle">{nutrition_facts.carbs}g</div>
                <div className="card-name">Carbs</div>
              </div>
            </div>

            <div className="col-auto">
              <div className="nutrition-card">
                <div className="card-circle">{nutrition_facts.fats}g</div>
                <div className="card-name">Fats</div>
              </div>
            </div>

            <div className="col-auto">
              <div className="nutrition-card">
                <div className="card-circle">{nutrition_facts.sugar}g</div>
                <div className="card-name">Sugar</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 版权信息 */}
      <div className="row foots text-center">
        <p>&copy; 2024 CookingAI. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default AIResponse;
