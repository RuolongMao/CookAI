// import React, { useState } from 'react';

// // Navbar Component
// const Navbar = ({ isLoggedIn, username }) => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       <a className="navbar-brand" href="#">CookingAI</a>
//       <div className="ml-auto">
//         {isLoggedIn ? (
//           <span className="navbar-text">Hello, {username}!</span>
//         ) : (
//           <span className="navbar-text">Hello, Guest!</span>
//         )}
//       </div>
//     </nav>
//   );
// };

// // Register Component
// const Register = ({ onRegisterSuccess }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     const response = await fetch('http://127.0.0.1:8000/register', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username, password }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       setMessage(data.message);
//       onRegisterSuccess(username);  // 注册成功后调用父组件的回调函数
//     } else {
//       const errorData = await response.json();
//       setMessage(errorData.detail);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <div className="form-group">
//           <label>Username</label>
//           <input
//             type="text"
//             className="form-control"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             className="form-control"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">Register</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// // ChatBox Component (Main Chat Functionality)
// const ChatBox = ({ username }) => {
//   const [message, setMessage] = useState("");
//   const [response, setResponse] = useState("No response yet");

//   function sendMessage() {
//     if (message === "") {
//       return;
//     }

//     fetch('http://127.0.0.1:8000/query', {
//       method: 'POST',
//       body: JSON.stringify({ prompt: message }),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     }).then(response => {
//       return response.json();
//     }).then(data => {
//       setResponse(data.response);
//     }).catch(error => {
//       console.error('Error:', error);
//     });

//     setMessage("");
//   }

//   function handleMessage(e) {   
//     setMessage(e.target.value); 
//   }

//   return (
//     <div>
//       <h2>Welcome, {username}!</h2>
//       <div className="container mx-auto mt-10">
//         <h1 className="text-4xl">Ask Anything!</h1>
//         <div className="mt-5 flex gap-2">
//           <input 
//             type="text" 
//             placeholder="Type your message here" 
//             value={message} 
//             className="input input-bordered w-full max-w-xs" 
//             onInput={handleMessage} 
//           />
//           <button className="btn btn-primary" onClick={sendMessage}>Send</button>
//         </div>
//         <div className="card mt-10">
//           <h2 className="text-xl">Response</h2>
//           <div className="mt-5">
//             🤖: {response}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Chat Component
// function Chat() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState('');

//   // Function to handle successful registration
//   const handleRegisterSuccess = (newUsername) => {
//     setIsLoggedIn(true);
//     setUsername(newUsername);
//   };

//   return (
//     <div>
//       {/* Navbar */}
//       <Navbar isLoggedIn={isLoggedIn} username={username} />

//       {/* Render Register or ChatBox based on login state */}
//       {!isLoggedIn ? (
//         <Register onRegisterSuccess={handleRegisterSuccess} />
//       ) : (
//         <ChatBox username={username} />
//       )}
//     </div>
//   );
// }

// export default Chat;


import React, { useState } from 'react';

const Home = ({ username }) => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("No response yet");

  function sendMessage() {
    if (message === "") {
      return;
    }

    fetch('http://127.0.0.1:8000/query', {
      method: 'POST',
      body: JSON.stringify({ prompt: message }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json();
    }).then(data => {
      setResponse(data.response);
    }).catch(error => {
      console.error('Error:', error);
    });

    setMessage("");
  }

  function handleMessage(e) {   
    setMessage(e.target.value); 
  }

  return (
    <div>
      <h2>Welcome, {username}!</h2>
      <div className="container mx-auto mt-10">
        <h1 className="text-4xl">Ask Anything!</h1>
        <div className="mt-5 flex gap-2">
          <input 
            type="text" 
            placeholder="Type your message here" 
            value={message} 
            className="input input-bordered w-full max-w-xs" 
            onInput={handleMessage} 
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
