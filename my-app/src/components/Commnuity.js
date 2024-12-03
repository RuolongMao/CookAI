import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Badge, Button, Card, Dropdown, Alert} from 'react-bootstrap';
import { MdClear, MdOutlineSearch} from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { Riple } from "react-loading-indicators";
import { useNavigate } from 'react-router-dom';
import "../css/Community.css";

function Community({ isLoggedIn }) {
  const [recipes, setRecipes] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [tasteOptions, setTasteOptions] = useState({ Sweet: false, Sour: false, Salty: false, Spicy: false });
  const [dietaryOptions, setDietaryOptions] = useState({ Vegan: false });
  const [costRange, setCostRange] = useState({ min: '', max: '' });
  const username = localStorage.getItem("username");
  const [cookingTime, setCookingTime] = useState({ min: '', max: '' });
  const [caloriesRange, setCaloriesRange] = useState({ min: '', max: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [allRecipes, setAllRecipes] = useState([]);
  const navigate = useNavigate();
  const [navbarHeight, setNavbarHeight] = useState(0); 
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Alert hides after 3 seconds
  };

  const hasInvalidRanges = () => {
    return (costRange.min && costRange.max && Number(costRange.min) > Number(costRange.max)) ||
          (cookingTime.min && cookingTime.max && Number(cookingTime.min) > Number(cookingTime.max)) ||
          (caloriesRange.min && caloriesRange.max && Number(caloriesRange.min) > Number(caloriesRange.max));
  };
  console.log(recipes)

  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
  }, [navbarHeight]);


  useEffect(() => {
    async function fetchRecipes() {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/get');
        const data = await response.json();
        const publishedRecipes = data.filter(recipe => recipe.publish === true);
        console.log('Fetched data:', data);
        console.log('publishedRecipes:', publishedRecipes);
        setRecipes(publishedRecipes);
        setAllRecipes(publishedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    }    
    fetchRecipes();
  }, []);
  
  const handleSaveToDashboard = async (recipe) => {
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }

    console.log(recipe);
  
    try {
      const dashboardRecipe = {
        recipe_name: recipe.recipe_name,
        user_name: username,
        image_url: recipe.image_url,
        details: recipe.details,
        est_cost: recipe.est_cost
      };
      
      const response = await fetch("http://localhost:8000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dashboardRecipe),
      });
  
    if (response.ok) {
      showAlertMessage("Recipe saved to dashboard successfully!");
    } else {
      showAlertMessage("Failed to save the recipe. Please try again.");
    }
  } catch (error) {
    console.error("Error saving recipe to dashboard:", error);
    showAlertMessage("An error occurred while saving the recipe.");
  }
};
  
  const handleSearch = async () => {
    if (!searchTerm) {
      setRecipes(allRecipes);
      return;
    }
  
    setIsLoading(true); // 开始加载
    try {
      const response = await fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe_name: searchTerm }),
      });
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching searched recipes:', error);
    } finally {
      setIsLoading(false); // 加载完成
    }
  };
  
  
  // Modify the handleFilter function to trigger filtering when the Search button is clicked
  const handleFilter = async () => {
    const selected = [];

    // Taste filters
    const tastes = [];
    Object.keys(tasteOptions).forEach((key) => {
      if (tasteOptions[key]) {
        selected.push(key);
        tastes.push(key);
      }
    });

    // Dietary filters
    if (dietaryOptions.Vegan) selected.push('Vegan');

    // Cost Range
    let est_cost_min = null;
    let est_cost_max = null;
    if (costRange.min || costRange.max) {
      selected.push(`Cost: ${costRange.min || '0'} - ${costRange.max || '∞'}`);
      est_cost_min = costRange.min ? parseFloat(costRange.min) : null;
      est_cost_max = costRange.max ? parseFloat(costRange.max) : null;
    }

    // Cooking Time
    let est_time_min = null;
    let est_time_max = null;
    if (cookingTime.min || cookingTime.max) {
      selected.push(`Time: ${cookingTime.min || '0'} - ${cookingTime.max || '∞'}`);
      est_time_min = cookingTime.min ? parseInt(cookingTime.min) : null;
      est_time_max = cookingTime.max ? parseInt(cookingTime.max) : null;
    }

    // Calories
    let calories_min = null;
    let calories_max = null;
    if (caloriesRange.min || caloriesRange.max) {
      selected.push(`Calories: ${caloriesRange.min || '0'} - ${caloriesRange.max || '∞'}`);
      calories_min = caloriesRange.min ? parseInt(caloriesRange.min) : null;
      calories_max = caloriesRange.max ? parseInt(caloriesRange.max) : null;
    }

    setSelectedFilters(selected);
    setIsLoading(true); // 开始加载

  // Fetch filtered recipes from the backend
    try {
      const response = await fetch('https://cookai-55f9.onrender.com/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          est_time_min,
          est_time_max,
          est_cost_min,
          est_cost_max,
          calories_min,
          calories_max,
          tastes,
        }),
      });
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching filtered recipes:', error);
    } finally {
      setIsLoading(false); // 加载完成
    }
  };

  const handleReset = () => {
    setTasteOptions({ Sweet: false, Sour: false, Salty: false, Spicy: false });
    setDietaryOptions({ Vegan: false });
    setCostRange({ min: '', max: '' });
    setCookingTime({ min: '', max: '' });
    setCaloriesRange({ min: '', max: '' });
    setSearchTerm('');
    setSelectedFilters([]);
    setRecipes(allRecipes);
  };

  return (
    <>
    {showAlert && (
    <Alert
      variant="warning"
      className="text-center position-fixed commu-alert"
    >
      {alertMessage}
    </Alert>
  )}

    <Container fluid className="commu-container">
      <Row>
      <Col
          md={3}
          className="p-3 commu-filter mt-3"
        >
          <Form>
          <div className="commu-search">
            <Form.Control
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              className="commu-search-input"
            />
            <MdOutlineSearch 
              className="commu-search-icon" 
              onClick={handleSearch}  
            />
            {searchTerm && (
              <MdClear
                onClick={() => {
                  setSearchTerm('');
                  setRecipes(allRecipes);
                }}
                className="commu-clear-icon"
              />
            )}

          </div>

            {/* <h5>Filters</h5> */}
            {['Taste', 'Dietary', 'Cost Range', 'Cooking Time', 'Calories'].map((label, index) => (
              <Form.Group key={index} className="mt-3">
                <Form.Label className="fs-5 fst-italic">{label}</Form.Label>

                {label === 'Taste' && (
                  <Row xs={2} className="commu-taste-row">
                    {['Sweet', 'Sour', 'Salty', 'Spicy'].map((flavor) => (
                      <Form.Check
                        key={flavor}
                        type="checkbox"
                        label={flavor}
                        checked={tasteOptions[flavor]}
                        onChange={(e) => setTasteOptions({ ...tasteOptions, [flavor]: e.target.checked })}
                      />
                    ))}
                  </Row>
                )}
                {label === 'Dietary' && 
                <Form.Check
                  type="checkbox"
                  label="Vegan"
                  checked={dietaryOptions.Vegan}
                  onChange={(e) => setDietaryOptions({ ...dietaryOptions, Vegan: e.target.checked })}
                />
                }

                {label === 'Cost Range' && (
                  <Form.Group className="mb-3 d-flex align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="min"
                      className="me-2 commu-filter-box"
                      value={costRange.min}
                      onChange={(e) => setCostRange({ ...costRange, min: e.target.value })}
                    />
                    {/* <span className="me-2">USD</span> */}
                    <span className="me-2">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
                    <Form.Control
                      type="text"
                      placeholder="max"
                      className="me-2 commu-filter-box"
                      value={costRange.max}
                      onChange={(e) => setCostRange({ ...costRange, max: e.target.value })}
                      isInvalid={costRange.min && costRange.max && Number(costRange.min) > Number(costRange.max)}
                    />
                    <span className="me-2">USD</span>
                  </Form.Group>
                )}
                
                {label === 'Cooking Time' && (
                  <Form.Group className="mb-3 d-flex align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="min"
                      className="me-2 commu-filter-box"
                      value={cookingTime.min}
                      onChange={(e) => setCookingTime({ ...cookingTime, min: e.target.value })}
                    />
                    {/* <span className="me-2">MIN</span> */}
                    <span className="me-2">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
                    <Form.Control
                      type="text"
                      placeholder="max"
                      className="me-2 commu-filter-box"
                      value={cookingTime.max}
                      onChange={(e) => setCookingTime({ ...cookingTime, max: e.target.value })}
                      isInvalid={cookingTime.min && cookingTime.max && Number(cookingTime.min) > Number(cookingTime.max)}
                    />
                    <span className="me-2">&nbsp;MIN</span>
                  </Form.Group>
                )}

              {label === 'Calories' && (
                <Form.Group className="mb-3 d-flex align-items-center">
                  <Form.Control
                    type="text"
                    placeholder="min"
                    className="me-2 commu-filter-box"
                    value={caloriesRange.min}
                    onChange={(e) => setCaloriesRange({ ...caloriesRange, min: e.target.value })}
                  />
                  {/* <span className="me-2">CAL</span> */}
                  <span className="me-2">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
                  <Form.Control
                    type="text"
                    placeholder="max"
                    className="me-2 commu-filter-box"
                    value={caloriesRange.max}
                    onChange={(e) => setCaloriesRange({ ...caloriesRange, max: e.target.value })}
                    isInvalid={caloriesRange.min && caloriesRange.max && Number(caloriesRange.min) > Number(caloriesRange.max)}
                  />
                  <span className="me-2">&nbsp;CAL</span>
                </Form.Group>
              )}

              </Form.Group>
            ))}

            {selectedFilters.length > 0 && (
              <Form.Group className="mt-3">
                <Form.Label className="fs-5 fst-italic">Selected Filters</Form.Label>
                <div className="mt-2">
                  {selectedFilters.map((filter, index) => (
                    <Badge key={index} bg="secondary" className="me-2">
                      {filter}
                    </Badge>
                  ))}
                </div>
              </Form.Group>
            )}



            <Form.Group className="d-flex justify-content-between mt-4">
              <Button 
                variant="outline-secondary" 
                style={{ width: '45%' }} 
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                variant="outline-primary"
                style={{ width: '47%' }}
                onClick={handleFilter}
                disabled={hasInvalidRanges()}
              >
                Apply
              </Button>
            </Form.Group>
          </Form>
        </Col>

  <Col md={9} className="p-3 commu-recipe-column">
    {isLoading ? (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        <Riple color="#6E757D" size="large" />
      </div>
    ) : recipes.length === 0 ? (
      <div className="commu-empty-state">
        <div className="commu-empty-state-icon">📚</div>
        <h3 className="commu-empty-state-title">Be the first to contribute!</h3>
      </div>
    ) : (
    <Row>
      {recipes.map((recipe, index) => (
        <Card 
        key={index} 
        style={{ width: '19.1rem' }} 
        className="mb-3 ms-4 ps-0 pe-0 commu-card"
        onClick={(e) => {
          if (!e.target.closest('.dropdown')) {
            navigate(`/recipe/${recipe.recipe_name}`, { 
              state: { 
                details: recipe.details, 
                image_url: recipe.image_url, 
                est_cost: recipe.est_cost
              } 
            });
          }
        }}
      >
          <Card.Img 
            variant="top" 
            src={recipe.image_url} 
            alt="Recipe Image" 
            className="img-fluid commu-card-img"
          /> 
          <Dropdown className="commu-dropdown">
            <Dropdown.Toggle as={BsThreeDots} className="commu-3dot" variant="link" />
            <Dropdown.Menu>
              <Dropdown.Item 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveToDashboard(recipe);
                }}
              >
                Save to Dashboard
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Card.Body className="d-flex flex-column gap-2">
            <Card.Title className="text-dark text-wrap mb-3" style={{ minHeight: '48px' }}>
              {recipe.recipe_name}
            </Card.Title>
            <p className="text-muted mb-0">{recipe.user_name}</p>
            <div className="d-flex">
              <Badge className="me-2 commu-timecost-badge">
                <i className="bi bi-clock"></i> {recipe.details.estimate_time}
              </Badge>
              <Badge className="me-2 commu-timecost-badge">
                <i className="bi bi-currency-dollar"></i> {recipe.details.estimated_cost}
              </Badge>
            </div>
            <div>
              <Badge bg="secondary">
                {recipe.details.nutrition_facts.calories} cal
              </Badge>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Row>
  )}
</Col>

      </Row>
    </Container>
    </>
  );
}

export default Community;
