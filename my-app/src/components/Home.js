import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import { Modal, Button } from "react-bootstrap";

const Home = () => {
  const [message, setMessage] = useState("");
  const [taste, setTaste] = useState([]);
  const [cookingMethod, setCookingMethod] = useState([]);
  const [allergen, setAllergen] = useState([]);
  const [activeCategory, setActiveCategory] = useState(""); // 记录当前自定义的分类

  const [showContent, setShowContent] = useState(false);
  const [slideUp, setSlideUp] = useState(false);

  // Modal Window
  const [showModal, setShowModal] = useState(false);
  const [customInput, setCustomInput] = useState("");

  // 自定义Cutom部分
  const [customTasteInput, setCustomTasteInput] = useState(null);
  const [customCookingMethodInput, setCustomCookingMethodInput] =
    useState(null);
  const [customAllergenInput, setCustomAllergenInput] = useState(null);

  const navigate = useNavigate();

  // 选项点击逻辑（正常选项 & Custom选项）
  const handleKeywordClick = (category, keyword) => {
    // Custom选项
    if (keyword === "Custom") {
      if (category === "taste") {
        // 已选中的状态
        if (customTasteInput !== null) {
          setCustomTasteInput(null);
          // 未选中的状态
        } else {
          setActiveCategory(category);
          setShowModal(true);
        }
      } else if (category === "cookingMethod") {
        if (customCookingMethodInput !== null) {
          setCustomCookingMethodInput(null);
        } else {
          setActiveCategory(category);
          setShowModal(true);
        }
      } else if (category === "allergen") {
        if (customAllergenInput !== null) {
          setCustomAllergenInput(null);
        } else {
          setActiveCategory(category);
          setShowModal(true);
        }
      }
    }

    // 正常选项
    else {
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
      } else if (category === "allergen") {
        setAllergen((prev) =>
          prev.includes(keyword)
            ? prev.filter((k) => k !== keyword)
            : [...prev, keyword]
        );
      }
    }
  };

  // Modal Window 部分
  const handleModalSave = () => {
    const trimmedInput = customInput.trim();
    if (!trimmedInput) {
      setCustomInput("");
      setShowModal(false);
      return;
    }
    if (activeCategory === "taste") {
      setCustomTasteInput(trimmedInput);
    } else if (activeCategory === "cookingMethod") {
      setCustomCookingMethodInput(trimmedInput);
    } else if (activeCategory === "allergen") {
      setCustomAllergenInput(trimmedInput);
    }
    setCustomInput("");
    setShowModal(false);
  };
  const handleModalClose = () => {
    setCustomInput(""); // 清空输入
    setShowModal(false); // 关闭模态框
  };

  // 点击触发动画部分
  const handleClick = () => {
    setSlideUp(true);
    setTimeout(() => {
      setShowContent(true);
    }, 600);
  };

  const sendMessage = () => {
    if (message === "") return;

    let prompt = `This is what I want to cook today: ${message}.`;

    // 处理 Taste
    if (taste.length > 0 || customTasteInput) {
      const tasteList = [...taste];
      if (customTasteInput) {
        tasteList.push(customTasteInput);
      }
      prompt += ` The taste is ${tasteList.join(", ")}.`;
    }

    // 处理 Cooking Method
    if (cookingMethod.length > 0 || customCookingMethodInput) {
      const methodList = [...cookingMethod];
      if (customCookingMethodInput) {
        methodList.push(customCookingMethodInput);
      }
      prompt += ` The cooking method is ${methodList.join(", ")}.`;
    }

    // 处理 Meal Time
    if (allergen.length > 0 || customAllergenInput) {
      const mealList = [...allergen];
      if (customAllergenInput) {
        mealList.push(customAllergenInput);
      }
      prompt += ` The allergen is ${mealList.join(", ")}.`;
    }

    // 输出检测
    console.log("Generated prompt is: ", prompt);

    navigate("/loading", { state: { prompt: prompt } });
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
          <p className="text-center mainbody-title">What you want to eat today?</p>
          <div className="row mt-4 selection">
            <div className="col-md-10 text-input-father">
              <input
                type="text"
                placeholder="I want to eat ..."
                value={message}
                className="form-control text-input"
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage(e.target.value);
                  }
                }}
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
                      t === "Custom"
                        ? customTasteInput
                          ? "active"
                          : ""
                        : taste.includes(t)
                        ? "active"
                        : ""
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
                      m === "Custom"
                        ? customCookingMethodInput
                          ? "active"
                          : ""
                        : cookingMethod.includes(m)
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleKeywordClick("cookingMethod", m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-4 cd">
              <h3 className="card-title">Allergen</h3>
              <div className="d-inline-flex gap-1">
                {["Milk", "Eggs", "Peanuts", "Custom"].map((meal) => (
                  <button
                    key={meal}
                    type="button"
                    className={`btn btn-outline-warning time ${
                      meal === "Custom"
                        ? customAllergenInput
                          ? "active"
                          : ""
                        : allergen.includes(meal)
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleKeywordClick("allergen", meal)}
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
      {/* dialogClassName="modal-dialog-centered" */}
      <Modal show={showModal} onHide={handleModalClose} dialogClassName="modal-dialog-centered custom-modal" >
        <Modal.Header closeButton>
          <Modal.Title>Customs By Yourself</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control cutom-input"
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
          <Button className="custom-botton-save" onClick={handleModalSave}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
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
