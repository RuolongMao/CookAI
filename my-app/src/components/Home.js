import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate 用于页面导航

const Home = () => {
  const [message, setMessage] = useState("");
  const [taste, setTaste] = useState([]);
  const [cookingMethod, setCookingMethod] = useState([]);
  const [mealTime, setMealTime] = useState([]);

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

  const sendMessage = () => {
    if (message === "") return;

    const prompt = ` This is what I want to cook today: ${message}. The taste is ${taste.join(", ")}; The cooking method is ${cookingMethod.join(", ")}; The meal time is ${mealTime.join(", ")}. Give me step by step instructions.`;

    console.log("Generated prompt is: ", prompt);

    // 点击 "Generate" 后跳转到 Loading 页面并传递 prompt
    navigate('/loading', { state: { prompt: prompt } });
  };

  return (
       <div className="container mt-5">
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
          {['Sweet', 'Spicy', 'Sour', 'Bitter'].map(t => (
            <button
              key={t}
              type="button"
              className="btn btn-primary"
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
          {['Grill', 'Boil', 'Fry', 'Bake'].map(m => (
            <button
              key={m}
              type="button"
              className="btn btn-primary"
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
          {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(meal => (
            <button
              key={meal}
              type="button"
              className="btn btn-primary"
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
  );
};

export default Home;





// import React, { useState } from "react";
// import { useNavigate } from 'react-router-dom'; // 导入 useNavigate 用于页面导航


// // Home组件接受prop参数：username，显示用户名字
// const Home = ({ username }) => {
//   //定义变量
//   const [message, setMessage] = useState("");
//   const [response, setResponse] = useState("No response yet");
//   const [loading, setLoading] = useState(false);
 

//   // 定义关键词状态
//   const [taste, setTaste] = useState([]);
//   const [cookingMethod, setCookingMethod] = useState([]);
//   const [mealTime, setMealTime] = useState([]);

//   const navigate = useNavigate(); // 使用 useNavigate 来处理页面跳转

//   const handleKeywordClick = (category, keyword) => {
//     if (category === "taste") {
//       setTaste((prev) =>
//         prev.includes(keyword)
//           ? prev.filter((k) => k !== keyword)
//           : [...prev, keyword]
//       );
//     } else if (category === "cookingMethod") {
//       setCookingMethod((prev) =>
//         prev.includes(keyword)
//           ? prev.filter((k) => k !== keyword)
//           : [...prev, keyword]
//       );
//     } else if (category === "mealTime") {
//       setMealTime((prev) =>
//         prev.includes(keyword)
//           ? prev.filter((k) => k !== keyword)
//           : [...prev, keyword]
//       );
//     }
//   };


//   // 处理消息发送
//   const sendMessage = () => {
//     if (message === "") {
//       return;
//     }

//     // 将所有选择的关键词合并成一个完整的 prompt
//     const prompt = ` This is what I want to cook today: ${message}.
//     The taste is ${taste.join(", ")};
//     The cooking method is ${cookingMethod.join(", ")};
//     The meal time is ${mealTime.join(", ")}.`;

//     // 打印 prompt 到控制台（用于检查代码问题）
//     console.log("Generated prompt is: ", prompt);

//     // 开始加载页面
//     setLoading(true); 


//     // 如果有内容，使用fetch函数，发送POST请求到API
//     fetch("http://127.0.0.1:8000/query", {
//       method: "POST",
//       body: JSON.stringify({ prompt: prompt }), //请求体是message
//       headers: {
//         "Content-Type": "application/json", //确认请求头，确认是JSON数据
//       },
//     })
//       // .then((response) => {
//       //   return response.json(); //处理服务器返回的响应，转换为JSON
//       // })
//       // .then((data) => {

//       //   setResponse(data.response); // 保存响应
//       //   setLoading(false); // 停止加载
       
//       //   // setResponse(data.response); //通过钩子函数，将服务器生成的响应（已经转换为JSON格式）更新到我的response状态，通过setResponse方法
//       // })
//       .then((response) => response.json())
//       .then((data) => {
//         setLoading(false); 
//         // 使用 useNavigate 将响应数据传递到 AIResponse 页面
//         navigate('/loading', { state: { response: data.response } });
//       })
//       .catch((error) => {
//         console.error("Error:", error); //处理返回错误，打印错误信息
//         setLoading(false);
//       });

//     setMessage(""); // 重置message状态，清空输入框
//   };

//   return (
//     <div className="container mt-5">
//     <h1 className="text-center">Create Your Recipe</h1>
//     <div className="row justify-content-center mt-4">
//       <div className="col-md-6">
//         <input
//           type="text"
//           placeholder="I want to eat ..."
//           value={message}
//           className="form-control"
//           onInput={(e) => setMessage(e.target.value)}
//         />
//       </div>
//       <div className="col-md-2">
//         <button className="btn btn-primary" onClick={sendMessage}>
//           Generate
//         </button>
//       </div>
//     </div>

//     <div className="row mt-4">
//       <div className="col-md-4">
//         <h3>Taste</h3>
//         <div className="d-inline-flex gap-1">
//           {['Sweet', 'Spicy', 'Sour', 'Bitter'].map(t => (
//             <button
//               key={t}
//               type="button"
//               className="btn btn-primary"
//               data-bs-toggle="button"
//               aria-pressed="false"
//               onClick={(e) => handleKeywordClick("taste", t, e)}
//             >
//               {t}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="col-md-4">
//         <h3>Cooking Method</h3>
//         <div className="d-inline-flex gap-1">
//           {['Grill', 'Boil', 'Fry', 'Bake'].map(m => (
//             <button
//               key={m}
//               type="button"
//               className="btn btn-primary"
//               data-bs-toggle="button"
//               aria-pressed="false"
//               onClick={(e) => handleKeywordClick("cookingMethod", m, e)}
//             >
//               {m}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="col-md-4">
//         <h3>Meal Time</h3>
//         <div className="d-inline-flex gap-1">
//           {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(meal => (
//             <button
//               key={meal}
//               type="button"
//               className="btn btn-primary"
//               data-bs-toggle="button"
//               aria-pressed="false"
//               onClick={(e) => handleKeywordClick("mealTime", meal, e)}
//             >
//               {meal}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>

//     {loading && <div>Loading...</div>}
//   </div>
//   );
// };

// export default Home;






// import React, { useState } from "react";


// // Home组件接受prop参数：username，显示用户名字
// const Home = ({ username }) => {
//   //定义变量
//   const [message, setMessage] = useState("");
//   const [response, setResponse] = useState("No response yet");
//   const [loading, setLoading] = useState(false);
 

//   // 定义关键词状态
//   const [taste, setTaste] = useState([]);
//   const [cookingMethod, setCookingMethod] = useState([]);
//   const [mealTime, setMealTime] = useState([]);

//   const handleKeywordClick = (category, keyword) => {
//     if (category === "taste") {
//       setTaste((prev) =>
//         prev.includes(keyword)
//           ? prev.filter((k) => k !== keyword)
//           : [...prev, keyword]
//       );
//     } else if (category === "cookingMethod") {
//       setCookingMethod((prev) =>
//         prev.includes(keyword)
//           ? prev.filter((k) => k !== keyword)
//           : [...prev, keyword]
//       );
//     } else if (category === "mealTime") {
//       setMealTime((prev) =>
//         prev.includes(keyword)
//           ? prev.filter((k) => k !== keyword)
//           : [...prev, keyword]
//       );
//     }
//   };


//   // 处理消息发送
//   const sendMessage = () => {
//     if (message === "") {
//       return;
//     }

//     // 将所有选择的关键词合并成一个完整的 prompt
//     const prompt = ` This is what I want to cook today: ${message}.
//     The taste is ${taste.join(", ")};
//     The cooking method is ${cookingMethod.join(", ")};
//     The meal time is ${mealTime.join(", ")}.`;

//     // 打印 prompt 到控制台（用于检查代码问题）
//     console.log("Generated prompt is: ", prompt);

//     // 开始加载页面
//     setLoading(true); 


//     // 如果有内容，使用fetch函数，发送POST请求到API
//     fetch("http://127.0.0.1:8000/query", {
//       method: "POST",
//       body: JSON.stringify({ prompt: prompt }), //请求体是message
//       headers: {
//         "Content-Type": "application/json", //确认请求头，确认是JSON数据
//       },
//     })
//       .then((response) => {
//         return response.json(); //处理服务器返回的响应，转换为JSON
//       })
//       .then((data) => {

//         setResponse(data.response); // 保存响应
//         setLoading(false); // 停止加载
       
//         // setResponse(data.response); //通过钩子函数，将服务器生成的响应（已经转换为JSON格式）更新到我的response状态，通过setResponse方法
//       })
//       .catch((error) => {
//         console.error("Error:", error); //处理返回错误，打印错误信息
//         setLoading(false);
//       });

//     setMessage(""); // 重置message状态，清空输入框
//   };

//   return (
// <div className="container mt-5">
//       <h1 className="text-center">Create Your Recipe</h1>
//       <div className="row justify-content-center mt-4">
//         <div className="col-md-6">
//           <input
//             type="text"
//             placeholder="I want to eat ..."
//             value={message}
//             className="form-control"
//             onInput={(e) => setMessage(e.target.value)}
//           />
//         </div>
//         <div className="col-md-2">
//           <button className="btn btn-primary" onClick={sendMessage}>Generate</button>
//         </div>
//       </div>

//       <div className="row mt-4">
//         <div className="col-md-4">
//           <h3>Taste</h3>
//           <div className="d-inline-flex gap-1">
//             {['Sweet', 'Spicy', 'Sour', 'Bitter'].map(t => (
//               <button
//                 key={t}
//                 type="button"
//                 className="btn btn-primary"
//                 data-bs-toggle="button"
//                 aria-pressed="false"
//                 onClick={(e) => handleKeywordClick("taste", t, e)}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="col-md-4">
//           <h3>Cooking Method</h3>
//           <div className="d-inline-flex gap-1">
//             {['Grill', 'Boil', 'Fry', 'Bake'].map(m => (
//               <button
//                 key={m}
//                 type="button"
//                 className="btn btn-primary"
//                 data-bs-toggle="button"
//                 aria-pressed="false"
//                 onClick={(e) => handleKeywordClick("cookingMethod", m, e)}
//               >
//                 {m}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="col-md-4">
//           <h3>Meal Time</h3>
//           <div className="d-inline-flex gap-1">
//             {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(meal => (
//               <button
//                 key={meal}
//                 type="button"
//                 className="btn btn-primary"
//                 data-bs-toggle="button"
//                 aria-pressed="false"
//                 onClick={(e) => handleKeywordClick("mealTime", meal, e)}
//               >
//                 {meal}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="mt-5">
//         <h2>Response</h2>
//         <div className="p-3 border">🤖: {response}</div>
//       </div>


//       {loading && <div>Loading...</div>}
//     </div>

//   );
// };

// export default Home;
