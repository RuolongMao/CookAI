import React, { useState } from 'react';


// Home组件接受prop参数：username，显示用户名字
const Home = ({ username }) => {
  //定义两个状态变量
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("No response yet");

  function handleMessage(e) {   
    setMessage(e.target.value);  //将输入框的信息更新到message状态中
  }

  function sendMessage() {
    // 如果用户没有输入任何内容，直接返回，不会发送post请求
    if (message === "") {
      return;
    }

    // 如果有内容，使用fetch函数，发送POST请求到API
    fetch('http://127.0.0.1:8000/query', {
      method: 'POST',
      body: JSON.stringify({ prompt: message }), //请求体是message
      headers: {
        'Content-Type': 'application/json' //确认请求头，确认是JSON数据
      }
    }).then(response => {
      return response.json(); //处理服务器返回的响应，转换为JSON
    }).then(data => {
      setResponse(data.response); //通过钩子函数，将服务器生成的响应（已经转换为JSON格式）更新到我的response状态，通过setResponse放啊
    }).catch(error => {
      console.error('Error:', error); //处理返回错误，打印错误信息
    });

    setMessage(""); // 重置message状态，清空输入框
  }



  return (
    <div>
      <div className="container mx-auto mt-10">
        <h1 className="text-4xl">Ask Anything!</h1>
        <div className="mt-5 flex gap-2">
          <input 
            type="text" 
            placeholder="Type your message here" 
            value={message} 
            className="input input-bordered w-full max-w-xs" 
            onInput={handleMessage} //用户输入时更新messgae状态，用于后面的请求题
          />
          
          <button className="btn btn-primary" onClick={sendMessage}>Send</button>
        </div>
        <div className="card mt-10">
          <h2 className="text-xl">Response</h2>
          <div className="mt-5">
            🤖: {response} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
