import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 导入 useNavigate 用于页面导航
import "../css/Home.css"

const Home = () => {
  const [message, setMessage] = useState("");
  const [taste, setTaste] = useState([]);
  const [cookingMethod, setCookingMethod] = useState([]);
  const [mealTime, setMealTime] = useState([]);

  const [showContent, setShowContent] = useState(false);
  const [slideUp, setSlideUp] = useState(false); // 控制 slide-up 效果

  const navigate = useNavigate(); // 使用 useNavigate 来处理页面跳转

  const handleKeywordClick = (category, keyword) => {
    if (category === "taste") {
      setTaste((prev) =>
        prev.includes(keyword)
          ? prev.filter((k) => k !== keyword)
          : [...prev, keyword]
      );
    } else if (category === "cookingMethod") {
      setCookingMethod((prev) =>
        prev.includes(keyword)
          ? prev.filter((k) => k !== keyword)
          : [...prev, keyword]
      );
    } else if (category === "mealTime") {
      setMealTime((prev) =>
        prev.includes(keyword)
          ? prev.filter((k) => k !== keyword)
          : [...prev, keyword]
      );
    }
  };

  // 当选中时才会在我的prompt加入更多的
  const sendMessage = () => {
    if (message === "") return;

    let prompt = `This is what I want to cook today: ${message}.`;

    if (taste.length > 0) {
      prompt += ` The taste is ${taste.join(", ")}.`;
    }

    if (cookingMethod.length > 0) {
      prompt += ` The cooking method is ${cookingMethod.join(", ")}.`;
    }

    if (mealTime.length > 0) {
      prompt += ` The meal time is ${mealTime.join(", ")}.`;
    }

    prompt += ` Provide the ingredients, including quantity and cost. Also provide detailed steps for the recipe in the following JSON format:
  {
    "ingredients": [
      {"name": "ingredient name", "quantity": "quantity", "cost": "cost"}
    ],
    "steps": [
      {"explanation": "explanation for this step", "instruction": "step instruction"}
    ],
    "estimated_cost": "total estimated cost"
  }`;

    // 输出检测
    console.log("Generated prompt is: ", prompt);

    navigate("/loading", { state: { prompt: prompt } });
  };


  // 点击触发 slide-up 动画
  const handleClick = () => {
    setSlideUp(true); // 触发 slide-up 效果
    setTimeout(() => {
      setShowContent(true); // 1.5 秒后显示主要内容
    }, 600);
  };

  return (
<div className="home-container">
      {/* 背景部分 */}
      <div className={`background-container ${showContent ? "background-active" : ""}`}
      onClick={handleClick}
      ></div>
      {!showContent ? (
        <h1 className={`before-txt ${slideUp ? "slide-up" : ""}`}>Click Anywhere to Start</h1> // 初始点击前显示内容
      ) : (
        <div className="container mt-5 mainbody">
          <h1 className="text-center">Create Your Recipe</h1>
          <div className="row justify-content-center mt-4">
            <div className="col-md-6">
              <input
                type="text"
                placeholder="I want to eat ..."
                value={message}
                className="form-control"
                onInput={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary" onClick={sendMessage}>
                Generate
              </button>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-4">
              <h3>Taste</h3>
              <div className="d-inline-flex gap-1">
                {["Sweet", "Spicy", "Sour", "Bitter"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="btn btn-outline-success"
                    data-bs-toggle="button"
                    aria-pressed="false"
                    onClick={(e) => handleKeywordClick("taste", t, e)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-4">
              <h3>Cooking Method</h3>
              <div className="d-inline-flex gap-1">
                {["Grill", "Boil", "Fry", "Bake"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className="btn btn-outline-warning"
                    data-bs-toggle="button"
                    aria-pressed="false"
                    onClick={(e) => handleKeywordClick("cookingMethod", m, e)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-4">
              <h3>Meal Time</h3>
              <div className="d-inline-flex gap-1">
                {["Breakfast", "Lunch", "Dinner", "Snack"].map((meal) => (
                  <button
                    key={meal}
                    type="button"
                    className="btn btn-outline-info"
                    data-bs-toggle="button"
                    aria-pressed="false"
                    onClick={(e) => handleKeywordClick("mealTime", meal, e)}
                  >
                    {meal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
