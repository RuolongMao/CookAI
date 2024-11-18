import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Badge, Button, Card} from 'react-bootstrap';
import { MdClear } from "react-icons/md";
// import Ratio from 'react-bootstrap/Ratio';
import { useNavigate } from 'react-router-dom';
import "../css/Community.css";

function Community() {
  const [recipes, setRecipes] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [tasteOptions, setTasteOptions] = useState({ Sweet: false, Sour: false, Salty: false, Spicy: false });
  const [dietaryOptions, setDietaryOptions] = useState({ Vegan: false });
  const [costRange, setCostRange] = useState({ min: '', max: '' });
  const [cookingTime, setCookingTime] = useState({ min: '', max: '' });
  const [caloriesRange, setCaloriesRange] = useState({ min: '', max: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [allRecipes, setAllRecipes] = useState([]);
  const navigate = useNavigate();
  const [navbarHeight, setNavbarHeight] = useState(0);

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
      const response = await fetch('http://localhost:8000/get');
      const data = await response.json();
      setRecipes(data);
      setAllRecipes(data);
    }
    fetchRecipes();
  }, []);
  

  const handleSearch = async () => {
    if (!searchTerm) {
      setRecipes(allRecipes);
      return;
    }
  
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

    // Fetch filtered recipes from the backend
    try {
      const response = await fetch('http://localhost:8000/filter', {
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
    }
  };

  
  return (
    <Container fluid className="commu-container">
      <Row>
      <Col
          md={3}
          className="p-3 commu-filter mt-3"
        >
          <Form>
          <div style={{ position: "relative", marginBottom: "20px" }}>
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

            <h5>Filters</h5>
            {['Taste', 'Dietary', 'Cost Range', 'Cooking Time', 'Calories'].map((label, index) => (
              <Form.Group key={index} className="mt-3">
                <Form.Label>{label}</Form.Label>
                {label === 'Taste' && (
                  <Row xs={2} className="commu-taste-row">
                    {['Sweet', 'Sour', 'Salty', 'Spicy'].map((flavor) => (
                      <Form.Check
                        key={flavor}
                        type="checkbox"
                        label={flavor}
                        onChange={(e) => setTasteOptions({ ...tasteOptions, [flavor]: e.target.checked })}
                      />
                    ))}
                  </Row>
                )}
                {label === 'Dietary' && 
                <Form.Check
                  type="checkbox"
                  label="Vegan"
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
                  />
                  <span className="me-2">&nbsp;CAL</span>
                </Form.Group>
              )}

              </Form.Group>
            ))}

            <Form.Group className="mt-3">
              <Form.Label>Selected Filters</Form.Label>
              <div className="mt-2">
                {selectedFilters.map((filter, index) => (
                  <Badge key={index} bg="secondary" className="me-2">
                    {filter}
                  </Badge>
                ))}
              </div>
            </Form.Group>


            <Form.Group className="d-flex justify-content-between mt-4">
              <Button variant="outline-secondary" style={{ width: '45%' }}>Reset</Button>
              <Button
                variant="outline-primary"
                style={{ width: '47%' }}
                onClick={handleFilter}
              >
                Search
              </Button>
            </Form.Group>
          </Form>
        </Col>

        <Col
          md={9}
          className="p-3 commu-recipe-column"
        >
          <Row>
            {recipes.map((recipe, index) => (
              <Card 
                key={index} 
                style={{ width: '19.1rem' }} 
                className="mb-3 ms-4 ps-0 pe-0 commu-card"
                onClick={() => navigate('/recipe', { state: { recipe } })} 
              >
                <Card.Img 
                  variant="top" 
                  src={recipe.image_url} 
                  alt="Recipe Image" 
                  className="img-fluid commu-card-img"
                />
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
        </Col>
      </Row>
    </Container>
  );
}

export default Community;
