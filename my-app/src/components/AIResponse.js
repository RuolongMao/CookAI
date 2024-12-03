import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Tooltip, OverlayTrigger, Tabs, Tab } from "react-bootstrap";
import NearbyStores from "./NearbyStores";
import Youtube from "./Youtube";

import "../css/AiReponse.css";

const AIResponse = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { recipe_Name } = useParams();

  const response = location.state?.response || null;
  const imageUrl = location.state?.image_url || null;
  const prompt = location.state?.prompt || null;

  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [liked, setLiked] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const username = localStorage.getItem("username");

  const [showShareDialog, setShowShareDialog] = useState(false);

  // 如果 response 不存在，则自动返回主页
  useEffect(() => {
    if (!response) {
      navigate("/");
    }
    console.log("AI Response: ", response);
    console.log("img", imageUrl);
    console.log("Prompt: ", prompt);
  }, [response, imageUrl, prompt, navigate]);

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
      text: `Here's a recipe you might enjoy: ${recipe_Name}.`,
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
      [index]: !prevState[index],
    }));
  };

  // 处理点赞功能
  const handleToggleLike = () => {
    if (!isLoggedIn) {
      // 如果用户未登录，跳转到登录页面
      navigate("/signin", { state: { from: location.pathname } });
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
      est_cost: parseFloat(estimated_cost.slice(1)),
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
      est_cost: parseFloat(estimated_cost.slice(1)),
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

  return (
    <div className="airesponse-container--fluid" style={{ height: 'calc(100vh - 72px)'}}>
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

      {/* 主内容区域 */}
      <div className="main-content flex-grow-1">
        <div className="row h-auto">
          {/* 左边列 */}
          <div className="col main-part-ai-left d-flex flex-column">
            <div className="row-ap-left1 flex-grow-1 ">
              {/* 按钮部分 */}
              <div className="like-right-part d-flex">
                <div className="button-group gap-3">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="regenerate-tooltip">Regenerate</Tooltip>
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="refresh-button bi bi-arrow-clockwise"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      onClick={handleRegenerate}
                      style={{ cursor: "pointer" }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                      />
                      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                    </svg>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="like-tooltip">Like</Tooltip>}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`heart-icon ${liked ? "liked" : ""}`}
                      viewBox="-1 -1 18 16"
                      onClick={handleToggleLike}
                      style={{ cursor: "pointer" }}
                    >
                      <path
                        fillRule="evenodd"
                        stroke={liked ? "black" : "black"}
                        strokeWidth={liked ? "0.7" : "1"}
                        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                      />
                    </svg>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="share-tooltip">Share</Tooltip>}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="bi bi-share-fill share-button"
                      viewBox="0 0 16 16"
                      onClick={handleShare}
                      style={{ cursor: "pointer" }}
                    >
                      <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
                    </svg>
                  </OverlayTrigger>
                </div>
              </div>

              {/* 图片部分 */}
              <div className="image-left-part-airesponse d-flex justify-content-center align-items-center">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Generated Recipe"
                    className="image"
                  />
                )}
              </div>

              {/* 标题部分 */}
              <div className="recipe_name-part-air">
                {recipe_name && (
                  <p className="recipe_name text-center">
                    {recipe_name.toUpperCase()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 右边列 */}
          <div className="col main-part-ai-right d-flex flex-column">
            <div className="tabs-container flex-grow-1 d-flex flex-column">
              <Tabs
                defaultActiveKey="overview"
                id="recipe-tabs"
                className="nav-tabs-custom"
              >
                <Tab eventKey="overview" title="Overview">
                  {/* Overview Content */}
                  <div className="tab-content flex-grow-1">
                    <div className="overview-content">
                      <h2 className="overview-content-title">Overview</h2>
                      <div className="estimate-air">
                        <div className="row cost-airesponse">
                          <div className="col-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="50"
                              height="80"
                              fill="currentColor"
                              class="bi bi-coin"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z" />
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                              <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12" />
                            </svg>
                          </div>
                          <div className="col-11 text-start">
                            <h2>Estimated Total Cost</h2>
                            <p>{estimated_cost}</p>
                          </div>
                        </div>

                        <div className="row time-airesponse">
                          <div className="col-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="50"
                              height="80"
                              fill="currentColor"
                              class="bi bi-alarm"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                              <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                            </svg>
                          </div>
                          <div className="col-11 text-start">
                            <h2>Estimated Time</h2>
                            <p>{estimate_time}</p>
                          </div>
                        </div>

                        <div className="row airesponse-nutrition-part">
                          <div className="col-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="50"
                              height="80"
                              fill="currentColor"
                              class="bi bi-clipboard-minus"
                              viewBox="0 0 16 16"
                              className="clip-board"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M5.5 9.5A.5.5 0 0 1 6 9h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5"
                              />
                              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                            </svg>
                          </div>

                          <div className="col-11">
                            <h2>Nutrition</h2>
                            {nutrition_facts && (
                              <div className="row justify-content-start nutrition-section-airesponse">
                                <div className="col-auto">
                                  <div className="nutrition-card-air">
                                    <div className="card-circle">
                                      {nutrition_facts.calories}
                                    </div>
                                    <div className="card-name">Calories</div>
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="nutrition-card-air">
                                    <div className="card-circle">
                                      {nutrition_facts.fiber}g
                                    </div>
                                    <div className="card-name">Fiber</div>
                                  </div>
                                </div>

                                <div className="col-auto">
                                  <div className="nutrition-card-air">
                                    <div className="card-circle">
                                      {nutrition_facts.protein}g
                                    </div>
                                    <div className="card-name">Protein</div>
                                  </div>
                                </div>

                                <div className="col-auto">
                                  <div className="nutrition-card-air">
                                    <div className="card-circle">
                                      {nutrition_facts.carbs}g
                                    </div>
                                    <div className="card-name">Carbs</div>
                                  </div>
                                </div>

                                <div className="col-auto">
                                  <div className="nutrition-card-air">
                                    <div className="card-circle">
                                      {nutrition_facts.fats}g
                                    </div>
                                    <div className="card-name">Fats</div>
                                  </div>
                                </div>

                                <div className="col-auto">
                                  <div className="nutrition-card-air">
                                    <div className="card-circle">
                                      {nutrition_facts.sugar}g
                                    </div>
                                    <div className="card-name">Sugar</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="ingredients" title="Ingredients">
                  {/* Ingredients Content */}
                  <div className="tab-content flex-grow-1">
                    <div className="ingredients-part-airesponse">
                      <h2>Ingredients</h2>
                      <div className="ingredients-list-airesponse">
                        {ingredients && ingredients.length > 0 ? (
                          <ul>
                            {ingredients.map((ingredient, index) => (
                              <li key={index} className="ingredient-item">
                                <div className="form-check d-flex justify-content-between align-items-center">
                                  <div>
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value=""
                                      id={`ingredient-checkbox-${index}`}
                                      checked={
                                        checkedIngredients[index] || false
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(index)
                                      }
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
                                        {ingredient.quantity} ({ingredient.cost}
                                        )
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
                      <div className="nearby-store-airesponse">
                        <NearbyStores />
                      </div>
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="steps" title="Steps">
                  {/* Steps Content */}
                  <div className="tab-content flex-grow-1">
                    <div className="steps-part-airesponse">
                      <h2>Steps</h2>
                      <div className="steps-list-part-airesponse">
                        {steps && steps.length > 0 ? (
                          <ol>
                            {steps.map((step, index) => (
                              <li key={index}>
                                <strong>{step.explanation}</strong> -{" "}
                                {step.instruction}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p>No steps provided.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Tab>
                {/* 
                <Tab eventKey="stores" title="Nearby Stores">
                  Nearby Stores Content
                  <div className="tab-content flex-grow-1">
                    <div className="nearby-stores-part"></div>
                  </div>
                </Tab> */}

                {/* 添加 Video Tutorials 选项卡 */}
                <Tab eventKey="video_tutorials" title="Video Tutorials">
                  <div className="tab-content flex-grow-1">
                    <Youtube />
                    <div className="generate_video">
                      <div
                        className="generate_video_button"
                        onClick={handleGenerateClick}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="25"
                          fill="currentColor"
                          class="bi bi-robot"
                          viewBox="2 0 16 16"
                        >
                          <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135" />
                          <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5" />
                        </svg>
                        Generate AI Video
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="row foots text-center">
        <p>&copy; 2024 CookingAI. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default AIResponse;
