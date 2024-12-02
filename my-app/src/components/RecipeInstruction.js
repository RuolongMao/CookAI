import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../css/RecipeInstruction.css";

const RecipeInstruction = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const { recipe_name } = useParams();
  const username = localStorage.getItem("username");
  const [recipe, setRecipeData] = useState({});
  const [newComment, setNewComment] = useState("");

  const fetchRecipeData = async () => {
    const response = await fetch("http://127.0.0.1:8000/get_one", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipe_name: recipe_name}),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Fetched recipe data:", data);
      setRecipeData(data);
    } else {
      console.error("Failed to fetch recipe data");
    }
  };

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      // 如果用户未登录，跳转到登录页面
      navigate("/signin");
      return;
    }

    if (!newComment.trim()) return;
    console.log(newComment)
    const response = await fetch("http://127.0.0.1:8000/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipe_name: recipe_name, username: username, comments: newComment }),
    });

    if (response.ok) {
      setNewComment("");
      await fetchRecipeData();
    } else {
      console.error("Failed to add comment");
    }
  };
  // Helper function to format cost
  const formatCost = (cost) => {
    if (!cost) return "N/A";
    // cost 是字符串形式的 "$25.00"
    return cost.replace('$', '').trim();
  };

  useEffect(() => {
    console.log(recipe_name)
    if (recipe_name) {
      fetchRecipeData();
    }
  }, [recipe_name]);

  return (
    <div className="container--fluid">
      {/* Image and Action Buttons Section */}
      <div className="row image-part">
        <div className="col-10 image-left-part">
          <img src={recipe?.image_url || "/api/placeholder/400/300"} alt="Recipe" className="image" />
        </div>

        <div className="col-2 like-right-part">
          <div className="row button-part">
            <div className="col-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="heart-icon"
                viewBox="-1 -1 18 16"
                style={{ cursor: "pointer" }}
              >
                <path
                  fillRule="evenodd"
                  stroke="black"
                  strokeWidth="1"
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
                style={{ cursor: "pointer" }}
              >
                <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Name Section */}
      <div className="row recipe_name-part">
        <p className="recipe_name text-center">
          {recipe?.recipe_name?.toUpperCase() || "NO RECIPE NAME"}
        </p>
      </div>

      {/* Ingredients and Estimates Section */}
      <div className="row section1">
        <div className="col ingredients-part">
          <h2>Ingredients</h2>
          <div className="ingredients-list">
            {recipe?.details?.ingredients && recipe.details.ingredients.length > 0 ? (
              <ul>
                {recipe.details.ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    <div className="form-check d-flex justify-content-between align-items-center">
                      <div>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`ingredient-checkbox-${index}`}
                        />
                        <label className="form-check-label" htmlFor={`ingredient-checkbox-${index}`}>
                          <span className="ingredient-name">{ingredient.name}</span>
                        </label>
                      </div>
                      <div>
                        <label className="form-check-label" htmlFor={`ingredient-checkbox-${index}`}>
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
              <p className="text-center mt-3">No ingredients available</p>
            )}
          </div>
        </div>

        <div className="col estimate">
          <div className="row cost">
            <div className="cost-name">
              <h2>Estimated Total Cost</h2>
            </div>
            <div className="estimate-cost">
              <p>${formatCost(recipe?.details?.estimated_cost)}</p>
            </div>
          </div>

          <div className="row time1">
            <div className="time-name">
              <h2>Estimated Time</h2>
            </div>
            <div className="estimate-time">
              <p>{recipe?.details?.estimate_time ? `${recipe.details.estimate_time} ` : "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="row steps-part">
        <h2>Steps</h2>
        <ol>
          {recipe?.details?.steps?.map((step, index) => (
            <li key={index}>
              <strong>{step.explanation}</strong> - {step.instruction}
            </li>
          ))}
        </ol>

        <div className="generate_video">
          {/* <div className="generate_video_button">
            Click here for Video
          </div> */}
        </div>
      </div>

      {/* Nutrition Section */}
      <div className="row nutrition-part">
        <h2>Nutrition</h2>
        <div className="row justify-content-center nutrition-section">
          {recipe?.details?.nutrition_facts ? (
            <>
              <div className="col-auto">
                <div className="nutrition-card">
                  <div className="card-circle">{recipe.details.nutrition_facts.calories}</div>
                  <div className="card-name">Calories</div>
                </div>
              </div>
              <div className="col-auto">
                <div className="nutrition-card">
                  <div className="card-circle">{recipe.details.nutrition_facts.fiber}g</div>
                  <div className="card-name">Fiber</div>
                </div>
              </div>
              <div className="col-auto">
                <div className="nutrition-card">
                  <div className="card-circle">{recipe.details.nutrition_facts.protein}g</div>
                  <div className="card-name">Protein</div>
                </div>
              </div>
              <div className="col-auto">
                <div className="nutrition-card">
                  <div className="card-circle">{recipe.details.nutrition_facts.carbs}g</div>
                  <div className="card-name">Carbs</div>
                </div>
              </div>
              <div className="col-auto">
                <div className="nutrition-card">
                  <div className="card-circle">{recipe.details.nutrition_facts.fats}g</div>
                  <div className="card-name">Fats</div>
                </div>
              </div>
              <div className="col-auto">
                <div className="nutrition-card">
                  <div className="card-circle">{recipe.details.nutrition_facts.sugar}g</div>
                  <div className="card-name">Sugar</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p>Nutrition information not available</p>
            </div>
          )}
        </div>
      </div>

      {/* Comment Section */}
      <div className="row comment-section">
        <h2>Comments</h2>
        <div className="comment-list">
          {recipe?.comments && Object.keys(recipe?.comments).length > 0 ? (
            Object.entries(recipe?.comments).map(([username, userComments], index) => (
              <div key={index} className="comment-item">
                <strong>{username}:</strong>
                <ul>
                  {userComments.map((comment, commentIndex) => (
                    <li key={commentIndex}>{comment}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>
        <div className="comment-input">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment..."
            rows="3"
            className="form-control"
          />
          <button
            onClick={handleAddComment}
            className="btn btn-primary mt-2"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="row foots text-center">
        <p>&copy; 2024 CookingAI. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default RecipeInstruction;