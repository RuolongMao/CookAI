import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "../css/QandA.css";

const QandA = () => {
  const [openQuestions, setOpenQuestions] = useState(new Set());

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const faqs = [
    {
      question: "What is ChefBotX?",
      answer:
        "ChefBotX is an AI-powered cooking assistant that helps you generate personalized recipes, complete with ingredients, instructions, nutritional information, and video tutorials. It can adapt recipes based on your preferences, dietary restrictions, and available ingredients.",
    },
    {
      question:
        "How accurate are the recipe costs and nutritional information?",
      answer:
        "The costs and nutritional information provided are estimates based on average market prices and standard nutritional databases. Actual costs may vary depending on your location and where you shop. For precise nutritional information, please consult with a healthcare professional.",
    },
    {
      question: "Can I save my favorite recipes?",
      answer:
        "Yes! Once you create an account and sign in, you can save any recipe to your personal dashboard by clicking the heart icon. You can access your saved recipes anytime from your dashboard.",
    },
    {
      question: "How do the video tutorials work?",
      answer:
        "Our AI generates step-by-step video tutorials for each recipe. These videos combine AI-generated visuals with clear voice instructions to guide you through the cooking process. The videos are automatically created based on the recipe steps.",
    },
    {
      question: "Can I specify dietary restrictions or preferences?",
      answer:
        "Absolutely! Before generating a recipe, you can specify any dietary restrictions, preferences, or allergies. Use the customization options to indicate if you want vegetarian, vegan, gluten-free, or other specific types of recipes.",
    },
    {
      question: "What if I don't have all the ingredients?",
      answer:
        "ChefBotX can suggest ingredient substitutions based on what you have available. When generating a recipe, you can mention which ingredients you have or don't have, and the AI will adapt accordingly.",
    },
    {
      question: "How do I share recipes with others?",
      answer:
        "Each recipe has a share button that allows you to share it directly through various platforms. You can also share recipes in our community section where other users can try them and provide feedback.",
    },
  ];

  const toggleQuestion = (index) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(index)) {
      newOpenQuestions.delete(index);
    } else {
      newOpenQuestions.add(index);
    }
    setOpenQuestions(newOpenQuestions);
  };

  return (
    <div className={`qa-container ${isLoaded ? "loaded" : ""}`}>
      <div className="qa-content">
        <h1 className="qa-title">Frequently Asked Questions</h1>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${isLoaded ? "fade-in" : ""}`}
              style={{ animationDelay: `${index * 0.2}s` }} // 设置延迟
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="faq-button"
              >
                <span className="faq-question">{faq.question}</span>
                {openQuestions.has(index) ? (
                  <ChevronUp className="faq-icon" size={20} />
                ) : (
                  <ChevronDown className="faq-icon" size={20} />
                )}
              </button>
              <div
                className={`faq-answer ${
                  openQuestions.has(index) ? "open" : ""
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="contact-section">
        <h2 className="contact-title">Have More Questions?</h2>
        <p className="contact-description">
          Feel free to reach out to us at{" "}
          <a href="mailto:yuqi40350@gmail.com" className="email-link">
            yuqi40350@gmail.com
          </a>
          . We’re happy to help!
        </p>
      </div>

      <footer className="text-center footer-fixed">
        <p>&copy; 2024 CookingAI. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default QandA;
