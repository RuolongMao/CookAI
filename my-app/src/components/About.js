
// import React, { useEffect, useState, useRef } from 'react';
// import { ChefHat, Code, Sparkles, Users, Utensils, Video } from 'lucide-react';
// import '../css/About.css';

// const About = () => {
//   const sections = [
//     { id: 0, content: <HeroSection /> },
//     { id: 1, content: <FeaturesGrid /> },
//     { id: 2, content: <HowItWorks /> },
//     { id: 3, content: <TechStack /> },
//   ];

//   const [currentSection, setCurrentSection] = useState(0);
//   const sectionRefs = useRef([]);

//   // 节流函数，防止滚动事件过于频繁
//   const throttle = (func, limit) => {
//     let inThrottle;
//     return function () {
//       const args = arguments;
//       const context = this;
//       if (!inThrottle) {
//         func.apply(context, args);
//         inThrottle = true;
//         setTimeout(() => (inThrottle = false), limit);
//       }
//     };
//   };

//   useEffect(() => {
//     const handleScroll = throttle(() => {
//       const scrollY = window.scrollY;
//       const windowHeight = window.innerHeight;

//       const newSection = Math.round(scrollY / windowHeight);

//       if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
//         setCurrentSection(newSection);
//       }
//     }, 200); // 每200ms触发一次

//     window.addEventListener('scroll', handleScroll);

//     // 清除监听器
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [currentSection, sections.length]);

//   return (
//     <div className="about-container">
//       {sections.map((section, index) => (
//         <div
//           key={section.id}
//           ref={(el) => (sectionRefs.current[index] = el)}
//           className={`section ${currentSection === index ? 'active' : ''}`}
//         >
//           {section.content}
//         </div>
//       ))}

//       {/* 版权信息 */}
//       <footer className="text-center footer-fixed">
//         <p>&copy; 2024 CookingAI. All Rights Reserved.</p>
//       </footer>
//     </div>
//   );
// };

// // 定义各个部分的内容
// const HeroSection = () => (
//   <div className="hero-section">
//     {/* <h1 className="hero-title">Welcome to CHEFBOTX</h1> */}
//     <p className="hero-description">
//       Your AI-powered culinary companion that transforms cooking ideas into detailed recipes, 
//       complete with step-by-step instructions and video tutorials.
//     </p>
//   </div>
// );

// const FeaturesGrid = () => (
// <div className="features-container">
//     <h2 className="features-title">Features</h2>
//     <div className="features-grid">
//       <div className="feature-card">
//         <div className="icon-container">
//           <Sparkles size={24} />
//         </div>
//         <h3 className="feature-title">AI Recipe Generation</h3>
//         <p className="feature-description">
//           Get personalized recipes based on your preferences, dietary restrictions, and available ingredients.
//         </p>
//       </div>

//       <div className="feature-card">
//         <div className="icon-container">
//           <Video size={24} />
//         </div>
//         <h3 className="feature-title">Video Tutorials</h3>
//         <p className="feature-description">
//           Watch AI-generated video tutorials that guide you through each recipe step by step.
//         </p>
//       </div>

//       <div className="feature-card">
//         <div className="icon-container">
//           <Users size={24} />
//         </div>
//         <h3 className="feature-title">Community</h3>
//         <p className="feature-description">
//           Join our growing community of food enthusiasts to share recipes and cooking experiences.
//         </p>
//       </div>
//     </div>
//   </div>
// );

// const HowItWorks = () => (
//   <div className="how-it-works">
//     <h2 className="section-title">How It Works</h2>
//     <div className="steps-container">
//       <div className="step">
//         <div className="step-icon">
//           <ChefHat size={32} />
//         </div>
//         <h3 className="step-title">1. Share Your Idea</h3>
//         <p className="step-description">Tell us what you'd like to cook and any specific preferences</p>
//       </div>

//       <div className="step">
//         <div className="step-icon">
//           <Utensils size={32} />
//         </div>
//         <h3 className="step-title">2. Get Your Recipe</h3>
//         <p className="step-description">Receive a detailed recipe with ingredients and instructions</p>
//       </div>

//       <div className="step">
//         <div className="step-icon">
//           <Video size={32} />
//         </div>
//         <h3 className="step-title">3. Watch & Cook</h3>
//         <p className="step-description">Follow along with our AI-generated video tutorial</p>
//       </div>
//     </div>
//   </div>
// );

// const TechStack = () => (
//   <div className="tech-container">
//     <div className="tech-header">
//       <Code size={32} />
//       <h2>Powered By</h2>
//     </div>
//     <div className="tech-grid">
//       <div className="tech-item">
//         <p>OpenAI</p>
//       </div>
//       <div className="tech-item">
//         <p>DALL·E</p>
//       </div>
//       <div className="tech-item">
//         <p>Youtube API</p>
//       </div>
//       <div className="tech-item">
//         <p>GoogleMap API</p>
//       </div>
//     </div>
//   </div>
// );

// export default About;






import React, { useEffect, useState, useRef } from 'react';
import { ChefHat, Code, Sparkles, Users, Utensils, Video } from 'lucide-react';
import '../css/About.css';

const About = () => {
  const sections = [
    { id: 0, content: <HeroSection /> },
    { id: 1, content: <FeaturesGrid /> },
    { id: 2, content: <HowItWorks /> },
    { id: 3, content: <TechStack /> },
  ];

  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef([]);

  // 节流函数，防止滚动事件过于频繁
  const throttle = (func, limit) => {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const newSection = Math.round(scrollY / windowHeight);

      if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
        setCurrentSection(newSection);
      }
    }, 200); // 每200ms触发一次

    window.addEventListener('scroll', handleScroll);

    // 清除监听器
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentSection, sections.length]);

  return (
    <div className="about-container">
      {sections.map((section, index) => (
        <div
          key={section.id}
          ref={(el) => (sectionRefs.current[index] = el)}
          className={`section ${currentSection === index ? 'active' : ''}`}
        >
          {section.content}
        </div>
      ))}

      {/* 版权信息 */}
      <footer className="text-center footer-fixed">
        <p>&copy; 2024 CookingAI. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

// 定义各个部分的内容
const HeroSection = () => (
  <div className="hero-section">
    {/* <h1 className="hero-title">Welcome to CHEFBOTX</h1> */}
    <p className="hero-description">
      Your AI-powered culinary companion that transforms cooking ideas into detailed recipes, 
      complete with step-by-step instructions and video tutorials.
    </p>
  </div>
);

const FeaturesGrid = () => (
  <div className="features-container">
    <h2 className="features-title">Features</h2>
    <div className="features-grid">
      <div className="feature-card">
        <div className="icon-container">
          <Sparkles size={24} />
        </div>
        <h3 className="feature-title gradient-text">AI Recipe Generation</h3>
        <p className="feature-description">
          Get personalized recipes based on your preferences, dietary restrictions, and available ingredients.
        </p>
      </div>

      <div className="feature-card">
        <div className="icon-container">
          <Video size={24} />
        </div>
        <h3 className="feature-title gradient-text">Video Tutorials</h3>
        <p className="feature-description">
          Watch AI-generated video tutorials that guide you through each recipe step by step.
        </p>
      </div>

      <div className="feature-card">
        <div className="icon-container">
          <Users size={24} />
        </div>
        <h3 className="feature-title gradient-text">Community</h3>
        <p className="feature-description">
          Join our growing community of food enthusiasts to share recipes and cooking experiences.
        </p>
      </div>
    </div>
  </div>
);

const HowItWorks = () => (
  <div className="how-it-works">
    <h2 className="section-title gradient-text">How It Works</h2>
    <div className="steps-container">
      <div className="step">
        <div className="step-icon">
          <ChefHat size={32} />
        </div>
        <h3 className="step-title gradient-text">Share Your Idea</h3>
        <p className="step-description">
          Tell us what you'd like to cook and any specific preferences.
        </p>
      </div>

      <div className="step">
        <div className="step-icon">
          <Utensils size={32} />
        </div>
        <h3 className="step-title gradient-text">Get Your Recipe</h3>
        <p className="step-description">
          Receive a detailed recipe with ingredients and instructions.
        </p>
      </div>

      <div className="step">
        <div className="step-icon">
          <Video size={32} />
        </div>
        <h3 className="step-title gradient-text">Watch & Cook</h3>
        <p className="step-description">
          Follow along with our AI-generated video tutorial.
        </p>
      </div>
    </div>
  </div>
);


const TechStack = () => (
  <div className="tech-container">
    <h2 className="section-title gradient-text">Powered By</h2>
    <div className="tech-grid">
      <div className="tech-item tech-item-enhanced">
        <p className="tech-text">OpenAI</p>
      </div>
      <div className="tech-item tech-item-enhanced">
        <p className="tech-text">DALL·E</p>
      </div>
      <div className="tech-item tech-item-enhanced">
        <p className="tech-text">YouTube API</p>
      </div>
      <div className="tech-item tech-item-enhanced">
        <p className="tech-text">GoogleMap API</p>
      </div>
    </div>
  </div>
);


export default About;
