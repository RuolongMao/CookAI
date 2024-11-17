import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Badge, Button, Card } from 'react-bootstrap';
import "../css/Community.css";

function Community() {
  const [recipes, setRecipes] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [tasteOptions, setTasteOptions] = useState({ Sweet: false, Sour: false, Salty: false, Spicy: false });
  const [dietaryOptions, setDietaryOptions] = useState({ Vegan: false });
  const [costRange, setCostRange] = useState({ min: '', max: '' });
  const [cookingTime, setCookingTime] = useState({ min: '', max: '' });


  useEffect(() => {
    async function fetchRecipes() {
      const response = await fetch('http://localhost:8000/get');
      const data = await response.json();
      setRecipes(data);
    }
    fetchRecipes();
  }, []);

  const handleSearch = () => {
    const selected = [];
  
    // Taste filters
    Object.keys(tasteOptions).forEach((key) => {
      if (tasteOptions[key]) selected.push(key);
    });
  
    // Dietary filters
    if (dietaryOptions.Vegan) selected.push('Vegan');
  
    // Cost Range
    if (costRange.min || costRange.max) {
      selected.push(`Cost: ${costRange.min || '0'} - ${costRange.max || '∞'}`);
    }
  
    // Cooking Time
    if (cookingTime.min || cookingTime.max) {
      selected.push(`Time: ${cookingTime.min || '0'} - ${cookingTime.max || '∞'}`);
    }
  
    setSelectedFilters(selected);
  };
  
  return (
    <Container fluid className="commu-container">
      <Row>
        <Col md={3} className="p-3 commu-filter mt-3">
          <Form>
            <Form.Control type="text" placeholder="Search recipes..." className="mb-3" />
            <h5>Filters</h5>
            {['Taste', 'Dietary', 'Cost Range', 'Cooking Time'].map((label, index) => (
              <Form.Group key={index} className="mt-3">
                <Form.Label>{label}</Form.Label>
                {label === 'Taste' && ['Sweet', 'Sour', 'Salty', 'Spicy'].map((flavor, idx) => (
                  <Form.Check
                  key={idx}
                  type="checkbox"
                  label={flavor}
                  onChange={(e) => setTasteOptions({ ...tasteOptions, [flavor]: e.target.checked })}
                />
                
                ))}
                {label === 'Dietary' && 
                <Form.Check
                  type="checkbox"
                  label="Vegan"
                  onChange={(e) => setDietaryOptions({ ...dietaryOptions, Vegan: e.target.checked })}
                />
                }

                {label === 'Cost Range' && (
                  <Form.Group className="mb-3 d-flex align-items-center">
                    <span className="me-2">$&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Form.Control
                      type="text"
                      placeholder="MIN"
                      className="me-2 commu-filter-box"
                      value={costRange.min}
                      onChange={(e) => setCostRange({ ...costRange, min: e.target.value })}
                    />
                    <span className="me-2">to</span>
                    <span className="me-2">$&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Form.Control
                      type="text"
                      placeholder="MAX"
                      className="commu-filter-box"
                      value={costRange.max}
                      onChange={(e) => setCostRange({ ...costRange, max: e.target.value })}
                    />
                  </Form.Group>
                )}
                
                {label === 'Cooking Time' && (
                  <Form.Group className="mb-3 d-flex align-items-center">
                    <span className="me-2">min</span>
                    <Form.Control
                      type="text"
                      placeholder="MIN"
                      className="me-2 commu-filter-box"
                      value={cookingTime.min}
                      onChange={(e) => setCookingTime({ ...cookingTime, min: e.target.value })}
                    />
                    <span className="me-2">to</span>
                    <span className="me-2">min</span>
                    <Form.Control
                      type="text"
                      placeholder="MAX"
                      className="commu-filter-box"
                      value={cookingTime.max}
                      onChange={(e) => setCookingTime({ ...cookingTime, max: e.target.value })}
                    />
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
                onClick={handleSearch}
              >
                Search
              </Button>
            </Form.Group>
          </Form>
        </Col>

        <Col md={9} className="p-3 commu-recipe-column">
          <Row>
            {recipes.map((recipe, index) => (
              <Card key={index} style={{ width: '19.2rem' }} className="mb-3 ms-4">
                <Card.Img variant="top" src={recipe.image_url} alt="Recipe Image" />
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
