import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AIResponse = () => {
  const navigate = useNavigate(); 
  const location = useLocation();  // 获取传递的状态

  // 从 location.state 中获取 response
  const response = location.state?.response || null;

  // 如果 response 不存在，则自动返回主页
  useEffect(() => {
    if (!response) {
      navigate('/');  // 如果没有 response，返回主页
    }
    console.log("AI Response: ", response)
  }, [response, navigate]);


  // 解析 response 中的内容
  const { ingredients, steps, estimated_cost } = response || {};

  // 如果 response 存在，显示它
  return (
    <div className="container mt-5">
      <h1 className="text-center">AI Generated Recipe</h1>
      
      <div className="mt-4">
        <h2>Ingredients</h2>
        {ingredients && ingredients.length > 0 ? (
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                <strong>{ingredient.name}</strong>: {ingredient.quantity} (Cost: {ingredient.cost})
              </li>
            ))}
          </ul>
        ) : (
          <p>No ingredients provided.</p>
        )}
      </div>

      <div className="mt-4">
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
      </div>

      <div className="mt-4">
        <h2>Estimated Total Cost</h2>
        <p>{estimated_cost}</p>
      </div>
    </div>
  );
};

export default AIResponse;
