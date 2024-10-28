import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/AiReponse.css";

const AIResponse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const response = location.state?.response || null;
  const imageUrl = location.state?.image_url || null;
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [liked, setLiked] = useState(false);




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

  const handleLikeClick = async () => {
    setLiked(true); // 设置为已点赞
    const body = {
      recipe_name: recipe_name,
      user_id: 1,
      image_url: imageUrl,
      details: response,
    }
    try {
      const res = await fetch("http://127.0.0.1:8000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        console.log("Like saved successfully");
      } else {
        console.error("Failed to save like");
      }
    } catch (error) {
      console.error("Error in saving like: ", error);
    }
  };

  const handleGenerateClick = () => {
    navigate("/video"); // Navigate to the video page when button is clicked
  };

  // 如果 response 存在，显示它
  return (
    <div className="container--fluid">
      <div className="row image-part">
        {imageUrl && (
          <img src={imageUrl} alt="Generated Recipe" className="image" />
        )}
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
      
      <div className="row justify-content-center">
        <button
          className={`btn ${liked ? "btn-success" : "btn-outline-success"}`}
          onClick={handleLikeClick}
          disabled={liked}
        >
          {liked ? "Liked!" : "Like"}
        </button>
      </div>

      {/* 版权信息 */}
      <div className="row foot text-center">
        <p>&copy; 2024 CookingAI. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default AIResponse;
