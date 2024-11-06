import React, { useState, useEffect } from 'react';
import '../css/Dashboard.css';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const itemsPerPage = 4;
  const username = localStorage.getItem("username");

  // Fetch user's liked recipes
  useEffect(() => {
    const fetchUserRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://chefbotx.onrender.com/dashboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_name: username })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load your recipes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRecipes();
  }, []);

  const formatCost = (cost) => {
    if (!cost) return "";
    return cost.replace('$', '').trim();
  };

  // Handle recipe deletion
  const handleDeleteRecipe = async (recipeName) => {
    try {
      const response = await fetch('https://chefbotx.onrender.com/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe_name: recipeName
        })
      });

      if (response.ok) {
        const updatedRecipes = recipes.filter(recipe => recipe.recipe_name !== recipeName);
        setRecipes(updatedRecipes);
        setFilteredRecipes(updatedRecipes);
      }
    } catch (err) {
      console.error('Error deleting recipe:', err);
    }
  };

  // Handle search
  useEffect(() => {
    const results = recipes.filter(recipe =>
      recipe.recipe_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecipes(results);
    setCurrentPage(1);
  }, [searchTerm, recipes]);

  // Pagination calculations
  const indexOfLastRecipe = currentPage * itemsPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Recipe Collection</h1>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search your recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3 className="empty-state-title">No recipes saved yet</h3>
          <p className="empty-state-text">Start exploring and saving recipes you love!</p>
        </div>
      ) : (
        <>
          <div className="recipes-grid">
            {currentRecipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-image-container">
                  <img
                    src={recipe.image_url || "/api/placeholder/400/300"}
                    alt={recipe.recipe_name}
                    className="recipe-image"
                  />
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteRecipe(recipe.recipe_name)}
                    aria-label="Delete recipe"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.recipe_name}</h3>
                  
                  <div className="recipe-stats">
                    <span className="stat-badge time-badge">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                      </svg>
                      {recipe.details.estimate_time}
                    </span>
                    <span className="stat-badge cost-badge">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      {formatCost(recipe.details.estimated_cost)}
                    </span>
                  </div>
                  
                  {recipe.details.nutrition_facts && (
                    <div className="badge-container">
                        <div className="nutrition-badges">
                        <span className="nutrition-badge">
                            {recipe.details.nutrition_facts.calories} cal
                        </span>
                        </div>
                        {recipe.details.allergen && recipe.details.allergen.length > 0 && (
                        <div className="allergen-tags">
                            {recipe.details.allergen.map((allergen, index) => (
                            <span key={index} className="allergen-badge">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="allergen-icon"
                                >
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                <line x1="12" y1="9" x2="12" y2="13"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                                </svg>
                                {allergen}
                            </span>
                            ))}
                        </div>
                        )}
                    </div>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;