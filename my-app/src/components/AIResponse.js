import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/AiReponse.css";

const AIResponse = ( {isLoggedIn } ) => {
  const navigate = useNavigate();
  const location = useLocation();
  const response = location.state?.response || null;
  const imageUrl = location.state?.image_url || null;
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [liked, setLiked] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // 提示信息状态
  const [showAlert, setShowAlert] = useState(false); // 控制 alert 显示状态

  // 如果 response 不存在，则自动返回主页
  useEffect(() => {
    if (!response) {
      navigate("/"); // 如果没有 response，返回主页
    }
    console.log("AI Response: ", response);
    console.log("img", imageUrl);
  }, [response, imageUrl, navigate]);

  // 解析 response 中的内容
  const {
    recipe_name,
    nutrition_facts,
    ingredients,
    steps,
    estimated_cost,
    estimate_time,
  } = response || {};

  // 处理复选框勾选状态变化
  const handleCheckboxChange = (index) => {
    setCheckedIngredients((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // 切换勾选状态
    }));
  };

  const handleToggleLike = async () => {

    if (!isLoggedIn) {       // 如果用户未登录，跳转到登录页面
      navigate("/signin");
      return;
    }

    const newLikedState = !liked; // 如果登陆了，执行下面逻辑，切换 liked 状态
    setLiked(newLikedState); // 更新状态

    const body = {
      recipe_name: recipe_name,
      user_id: 1,
      image_url: imageUrl,
      details: response,
    };

    if (newLikedState) {
      // 如果现在是喜欢状态，发送创建请求
      setAlertMessage("You have liked this recipe!");
      setShowAlert(true);
      await fetch("http://127.0.0.1:8000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } else {
      // 如果现在是未喜欢状态，发送删除请求
      setAlertMessage("You have unliked this recipe!");
      setShowAlert(true);
      await fetch("http://127.0.0.1:8000/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipe_name: recipe_name }),
      });
    }
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleGenerateClick = () => {
    navigate("/video"); // Navigate to the video page when button is clicked
  };

  // 如果 response 存在，显示它
  return (
    <div className="container--fluid">
      {showAlert && (
        <div className="alert alert-primary text-center fade-in-out" role="alert">
          {alertMessage}
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
                className={`heart-icon ${liked ? "liked" : ""}`}
                viewBox="-1 -1 18 16"
                onClick={handleToggleLike}
                style={{ cursor: "pointer" }}
              >
                <path
                  fillRule="evenodd"
                  stroke={liked ? "" : "black"}
                  strokeWidth={liked ? "" : "0.7"}
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                />
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
