// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // 导入 useNavigate 用于页面导航
// import "../css/Home.css";

// const Home = () => {
//   const [message, setMessage] = useState("");
//   const [taste, setTaste] = useState([]);
//   const [cookingMethod, setCookingMethod] = useState([]);
//   const [mealTime, setMealTime] = useState([]);

//   const [showContent, setShowContent] = useState(false);
//   const [slideUp, setSlideUp] = useState(false); // 控制 slide-up 效果

//   const [customInput, setCustomInput] = useState(""); // 用于保存自定义输入
//   const [activeCategory, setActiveCategory] = useState(""); // 记录当前自定义的分类（taste、cookingMethod、mealTime）

//   const navigate = useNavigate(); // 使用 useNavigate 来处理页面跳转

//   const handleKeywordClick = (category, keyword) => {
//     if (keyword === "Custom") {
//       setActiveCategory(category); // 保存当前自定义的类别
//       const modalTrigger = document.getElementById("exampleModal");
//       const modal = new window.bootstrap.Modal(modalTrigger);
//       modal.show(); // 显示模态框
//     } else {
//       if (category === "taste") {
//         setTaste((prev) =>
//           prev.includes(keyword)
//             ? prev.filter((k) => k !== keyword)
//             : [...prev, keyword]
//         );
//       } else if (category === "cookingMethod") {
//         setCookingMethod((prev) =>
//           prev.includes(keyword)
//             ? prev.filter((k) => k !== keyword)
//             : [...prev, keyword]
//         );
//       } else if (category === "mealTime") {
//         setMealTime((prev) =>
//           prev.includes(keyword)
//             ? prev.filter((k) => k !== keyword)
//             : [...prev, keyword]
//         );
//       }
//     }
//   };

//   // 当选中时才会在我的prompt加入更多的
//   const sendMessage = () => {
//     if (message === "") return;

//     let prompt = `This is what I want to cook today: ${message}.`;

//     if (taste.length > 0) {
//       prompt += ` The taste is ${taste.join(", ")}.`;
//     }

//     if (cookingMethod.length > 0) {
//       prompt += ` The cooking method is ${cookingMethod.join(", ")}.`;
//     }

//     if (mealTime.length > 0) {
//       prompt += ` The meal time is ${mealTime.join(", ")}.`;
//     }

//     prompt += ` Provide the ingredients, including quantity and cost. Also provide detailed steps for the recipe in the following JSON format:
//   {
//     "ingredients": [
//       {"name": "ingredient name", "quantity": "quantity", "cost": "cost"}
//     ],
//     "steps": [
//       {"explanation": "explanation for this step", "instruction": "step instruction"}
//     ],
//     "estimated_cost": "total estimated cost"
//   }`;

//     // 输出检测
//     console.log("Generated prompt is: ", prompt);

//     navigate("/loading", { state: { prompt: prompt } });
//   };

//   // 点击触发 slide-up 动画
//   const handleClick = () => {
//     setSlideUp(true); // 触发 slide-up 效果
//     setTimeout(() => {
//       setShowContent(true); // 1.5 秒后显示主要内容
//     }, 600);
//   };

//   const handleModalSave = () => {
//     if (activeCategory === "taste") {
//       setTaste((prev) => [...prev, customInput]);
//     } else if (activeCategory === "cookingMethod") {
//       setCookingMethod((prev) => [...prev, customInput]);
//     } else if (activeCategory === "mealTime") {
//       setMealTime((prev) => [...prev, customInput]);
//     }

//     const modalTrigger = document.getElementById("exampleModal");
//     const modal = new window.bootstrap.Modal(modalTrigger);
//     modal.hide(); // 隐藏模态框
//     setCustomInput(""); // 清空输入
//   };

//   return (
//     <div className="home-container">
//       {/* 背景部分 */}
//       <div
//         className={`background-container ${
//           showContent ? "background-active" : ""
//         }`}
//         onClick={handleClick}
//       ></div>
//       {!showContent ? (
//         <h1
//           className={`before-txt ${slideUp ? "slide-up" : ""}`}
//           onClick={handleClick}
//         >
//           Click Anywhere to Start
//         </h1> // 初始点击前显示内容
//       ) : (
//         <div className="container mt-5 mainbody">
//           <h1 className="text-center title">What you want to eat today?</h1>
//           <div className="row mt-4 selection">
//             <div className="col-md-10 text-input-father">
//               <input
//                 type="text"
//                 placeholder="I want to eat ..."
//                 value={message}
//                 className="form-control text-input"
//                 onInput={(e) => setMessage(e.target.value)}
//               />
//             </div>
//             <div className="col-md-2">
//               <button
//                 className="btn btn-warning submit-button"
//                 onClick={sendMessage}
//               >
//                 Generate
//               </button>
//             </div>
//           </div>

//           <div className="row mt-4 text-center">
//             <div className="col-md-4 cd">
//               <h3 className="card-title">Taste</h3>
//               <div className="d-inline-flex gap-1">
//                 {["Sweet", "Spicy", "Sour", "Custom"].map((t) => (
//                   <button
//                     key={t}
//                     type="button"
//                     className="btn btn-outline-warning taste"
//                     data-bs-toggle="button"
//                     aria-pressed="false"
//                     onClick={(e) => handleKeywordClick("taste", t, e)}
//                   >
//                     {t}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="col-md-4 cd">
//               <h3 className="card-title">Cooking Method</h3>
//               <div className="d-inline-flex gap-1">
//                 {["Grill", "Boil", "Fry", "Custom"].map((m) => (
//                   <button
//                     key={m}
//                     type="button"
//                     className="btn btn-outline-warning method"
//                     data-bs-toggle="button"
//                     aria-pressed="false"
//                     onClick={(e) => handleKeywordClick("cookingMethod", m, e)}
//                   >
//                     {m}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="col-md-4 cd">
//               <h3 className="card-title">Meal Time</h3>
//               <div className="d-inline-flex gap-1">
//                 {["Breakfast", "Lunch", "Dinner", "Custom"].map((meal) => (
//                   <button
//                     key={meal}
//                     type="button"
//                     className="btn btn-outline-warning time"
//                     data-bs-toggle="button"
//                     aria-pressed="false"
//                     onClick={(e) => handleKeywordClick("mealTime", meal, e)}
//                   >
//                     {meal}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal 弹窗部分 */}
//       <div
//         className="modal fade"
//         id="exampleModal"
//         tabIndex="-1"
//         aria-labelledby="exampleModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h1 className="modal-title fs-5" id="exampleModalLabel">
//                 Enter Custom {activeCategory}
//               </h1>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter your custom option"
//                 value={customInput}
//                 onChange={(e) => setCustomInput(e.target.value)}
//               />
//             </div>
//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 data-bs-dismiss="modal"
//               >
//                 Close
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-primary"
//                 onClick={handleModalSave}
//               >
//                 Save changes
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 版权信息 */}
//       <footer className="text-center footer-fixed">
//         <p>&copy; 2024 CookingAI. All Rights Reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Home;





import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import { Modal, Button } from 'react-bootstrap';

const Home = () => {
  const [message, setMessage] = useState("");
  const [taste, setTaste] = useState([]);
  const [cookingMethod, setCookingMethod] = useState([]);
  const [mealTime, setMealTime] = useState([]);

  const [showContent, setShowContent] = useState(false);
  const [slideUp, setSlideUp] = useState(false);

  const [showModal, setShowModal] = useState(false); // 控制模态框显示
  const [customInput, setCustomInput] = useState(""); // 用于保存自定义输入
  const [activeCategory, setActiveCategory] = useState(""); // 记录当前自定义的分类

  const navigate = useNavigate();

  const handleKeywordClick = (category, keyword) => {
    if (keyword === "Custom") {
      setActiveCategory(category); // 保存当前自定义的类别
      setShowModal(true); // 显示模态框
    } else {
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
    }
  };

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
    setSlideUp(true);
    setTimeout(() => {
      setShowContent(true);
    }, 600);
  };

  // 处理模态框的保存和关闭
  const handleModalSave = () => {
    if (activeCategory === "taste") {
      setTaste((prev) => [...prev, customInput]);
    } else if (activeCategory === "cookingMethod") {
      setCookingMethod((prev) => [...prev, customInput]);
    } else if (activeCategory === "mealTime") {
      setMealTime((prev) => [...prev, customInput]);
    }
    setCustomInput(""); // 清空输入
    setShowModal(false); // 关闭模态框
  };

  const handleModalClose = () => {
    setCustomInput(""); // 清空输入
    setShowModal(false); // 关闭模态框
  };

  return (
    <div className="home-container">
      {/* 背景部分 */}
      <div
        className={`background-container ${
          showContent ? "background-active" : ""
        }`}
        onClick={handleClick}
      ></div>
      {!showContent ? (
        <h1
          className={`before-txt ${slideUp ? "slide-up" : ""}`}
          onClick={handleClick}
        >
          Click Anywhere to Start
        </h1>
      ) : (
        <div className="container mt-5 mainbody">
          <h1 className="text-center title">What you want to eat today?</h1>
          <div className="row mt-4 selection">
            <div className="col-md-10 text-input-father">
              <input
                type="text"
                placeholder="I want to eat ..."
                value={message}
                className="form-control text-input"
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-warning submit-button"
                onClick={sendMessage}
              >
                Generate
              </button>
            </div>
          </div>

          <div className="row mt-4 text-center">
            <div className="col-md-4 cd">
              <h3 className="card-title">Taste</h3>
              <div className="d-inline-flex gap-1">
                {["Sweet", "Spicy", "Sour", "Custom"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`btn btn-outline-warning taste ${
                      taste.includes(t) ? "active" : ""
                    }`}
                    onClick={() => handleKeywordClick("taste", t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-4 cd">
              <h3 className="card-title">Cooking Method</h3>
              <div className="d-inline-flex gap-1">
                {["Grill", "Boil", "Fry", "Custom"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`btn btn-outline-warning method ${
                      cookingMethod.includes(m) ? "active" : ""
                    }`}
                    onClick={() => handleKeywordClick("cookingMethod", m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-4 cd">
              <h3 className="card-title">Meal Time</h3>
              <div className="d-inline-flex gap-1">
                {["Breakfast", "Lunch", "Dinner", "Custom"].map((meal) => (
                  <button
                    key={meal}
                    type="button"
                    className={`btn btn-outline-warning time ${
                      mealTime.includes(meal) ? "active" : ""
                    }`}
                    onClick={() => handleKeywordClick("mealTime", meal)}
                  >
                    {meal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 弹窗部分 */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Custom {activeCategory}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your custom option"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleModalSave();
              }
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 版权信息 */}
      <footer className="text-center footer-fixed">
        <p>&copy; 2024 CookingAI. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
