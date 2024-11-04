import React from 'react';
import { ChefHat, Code, Sparkles, Users, Utensils, Video } from 'lucide-react';
import '../css/About.css';

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Welcome to CookingAI</h1>
        <p className="hero-description">
          Your AI-powered culinary companion that transforms cooking ideas into detailed recipes, 
          complete with step-by-step instructions and video tutorials.
        </p>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="icon-container">
            <Sparkles size={24} />
          </div>
          <h3 className="feature-title">AI Recipe Generation</h3>
          <p className="feature-description">
            Get personalized recipes based on your preferences, dietary restrictions, and available ingredients.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-container">
            <Video size={24} />
          </div>
          <h3 className="feature-title">Video Tutorials</h3>
          <p className="feature-description">
            Watch AI-generated video tutorials that guide you through each recipe step by step.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-container">
            <Users size={24} />
          </div>
          <h3 className="feature-title">Community</h3>
          <p className="feature-description">
            Join our growing community of food enthusiasts to share recipes and cooking experiences.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">
              <ChefHat size={32} />
            </div>
            <h3 className="step-title">1. Share Your Idea</h3>
            <p className="step-description">Tell us what you'd like to cook and any specific preferences</p>
          </div>

          <div className="step">
            <div className="step-icon">
              <Utensils size={32} />
            </div>
            <h3 className="step-title">2. Get Your Recipe</h3>
            <p className="step-description">Receive a detailed recipe with ingredients and instructions</p>
          </div>

          <div className="step">
            <div className="step-icon">
              <Video size={32} />
            </div>
            <h3 className="step-title">3. Watch & Cook</h3>
            <p className="step-description">Follow along with our AI-generated video tutorial</p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      {/* <div className="tech-stack"> */}
        <div className="tech-container">
          <div className="tech-header">
            <Code size={32} />
            <h2>Powered By</h2>
          </div>
          <div className="tech-grid">
            <div className="tech-item">
              <p>OpenAI</p>
            </div>
            <div className="tech-item">
              <p>DALL·E</p>
            </div>
            <div className="tech-item">
              <p>Youtube API</p>
            </div>
            {/* <div className="tech-item">
              <p></p>
            </div> */}
          {/* </div> */}
        </div>
      </div>

      {/* 版权信息 */}
      <footer className="text-center footer-fixed">
        <p>&copy; 2024 CookingAI. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default About;