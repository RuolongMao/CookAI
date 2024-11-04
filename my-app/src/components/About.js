import React from 'react';
import { ChefHat, Code, Sparkles, Users, Utensils, Video } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 pt-20">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-4">Welcome to CookingAI</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your AI-powered culinary companion that transforms cooking ideas into detailed recipes, 
            complete with step-by-step instructions and video tutorials.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI Recipe Generation */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Recipe Generation</h3>
            <p className="text-gray-600">
              Get personalized recipes based on your preferences, dietary restrictions, and available ingredients.
            </p>
          </div>

          {/* Video Tutorials */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
              <Video className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Tutorials</h3>
            <p className="text-gray-600">
              Watch AI-generated video tutorials that guide you through each recipe step by step.
            </p>
          </div>

          {/* Community Features */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600">
              Join our growing community of food enthusiasts to share recipes and cooking experiences.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Share Your Idea</h3>
              <p className="text-gray-600">Tell us what you'd like to cook and any specific preferences</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
                <Utensils className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Get Your Recipe</h3>
              <p className="text-gray-600">Receive a detailed recipe with ingredients and instructions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
                <Video className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Watch & Cook</h3>
              <p className="text-gray-600">Follow along with our AI-generated video tutorial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Code className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Powered By</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="font-semibold">React</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="font-semibold">FastAPI</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="font-semibold">OpenAI</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="font-semibold">DALL·E</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">&copy; 2024 CookingAI. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;