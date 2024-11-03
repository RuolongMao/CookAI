import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Badge, Pagination } from 'react-bootstrap';
import "../css/Community.css";

const Community = () => {
  // States
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Fetch recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/recipes');
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  
  // Calculate pagination values
  const totalItems = recipes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page's items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = recipes.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    document.querySelector('.recipes-container').scrollTop = 0;
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    let items = [];
    
    if (totalPages > 1) {
      // Add First and Prev buttons
      items.push(
        <Pagination.First 
          key="first" 
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        />
      );
      items.push(
        <Pagination.Prev 
          key="prev" 
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
      );

      // Add page numbers
      for (let number = 1; number <= totalPages; number++) {
        if (
          number === 1 || 
          number === totalPages ||
          (number >= currentPage - 1 && number <= currentPage + 1)
        ) {
          items.push(
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </Pagination.Item>
          );
        } else if (
          number === currentPage - 2 ||
          number === currentPage + 2
        ) {
          items.push(<Pagination.Ellipsis key={`ellipsis-${number}`} />);
        }
      }

      // Add Next and Last buttons
      items.push(
        <Pagination.Next 
          key="next" 
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      );
      items.push(
        <Pagination.Last 
          key="last" 
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        />
      );
    }

    return items;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Container fluid className="h-full py-3">
        <Row className="h-full">
          {/* Left Section - Search and Filters */}
          <Col md={3} className="h-full">
            <div className="h-full flex flex-col">
              {/* Search Bar */}
              <div className="position-relative mb-3">
                <Form.Control
                  type="search"
                  placeholder="Search recipes..."
                  className="pe-5"
                />
                <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-2 text-muted"></i>
              </div>

              {/* Filter Panel - Scrollable */}
              <div className="filter-panel bg-white p-3 rounded shadow-sm flex-1">
                <h5 className="mb-2">Filters</h5>
                
                {/* Taste Filter */}
                <div className="mb-3">
                  <h6 className="mb-1">Taste</h6>
                  {['Sweet', 'Sour', 'Salty', 'Spicy'].map(taste => (
                    <Form.Check
                      key={taste}
                      type="checkbox"
                      label={taste}
                      className="mb-1"
                    />
                  ))}
                </div>

                {/* Vegan Option */}
                <div className="mb-3">
                  <h6 className="mb-1">Dietary</h6>
                  <Form.Check
                    type="checkbox"
                    label="Vegan"
                    className="mb-1"
                  />
                </div>

                {/* Cost Range */}
                <div className="mb-3">
                  <h6 className="mb-1">Cost Range</h6>
                  <Form.Range min={0} max={100} />
                  <div className="d-flex justify-content-between text-muted small">
                    <span>$0</span>
                    <span>$100</span>
                  </div>
                </div>

                {/* Time Range */}
                <div className="mb-3">
                  <h6 className="mb-1">Cooking Time</h6>
                  <Form.Range min={0} max={180} />
                  <div className="d-flex justify-content-between text-muted small">
                    <span>0 min</span>
                    <span>180 min</span>
                  </div>
                </div>

                {/* Selected Filters */}
                <div>
                  <h6 className="mb-1">Selected Filters</h6>
                  <Badge bg="secondary" className="me-1 mb-1">Sweet ×</Badge>
                  <Badge bg="secondary" className="me-1 mb-1">Vegan ×</Badge>
                  <Badge bg="secondary" className="me-1 mb-1">&lt; 60 min ×</Badge>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Section - Recipe Grid with Scrollable Content */}
          <Col md={9} className="h-full">
            <div className="h-full flex flex-col">
              {/* Scrollable Recipe Grid */}
              <div className="recipes-container">
                {recipes.length === 0 ? (
                  <div className="empty-state text-center p-5">
                    <div className="empty-icon mb-3">
                      <i className="bi bi-journal-plus" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                    </div>
                    <h3 className="text-muted mb-2">Our Community is Waiting for You!</h3>
                    <p className="text-muted">
                      Be the first to share your amazing recipe and start building our cooking community.
                    </p>
                  </div>
                ) : (
                  <div className="recipe-grid">
                    {currentItems.map((recipe) => (
                      <Card key={recipe.id} className="recipe-card">
                        <div className="recipe-image-container">
                          <Card.Img 
                            variant="top" 
                            src={recipe.image_url || "/api/placeholder/400/300"}
                            alt="Recipe" 
                            className="recipe-card-img"
                          />
                        </div>
                        <Card.Body className="recipe-card-body">
                          <div className="user-info">
                            <span className="user-name">{recipe.user_id}</span>
                          </div>
                          <Card.Title className="recipe-title">{recipe.recipe_name}</Card.Title>
                          <Card.Text className="publish-date">
                            Published: {new Date(recipe.created_time).toLocaleDateString()}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Only show pagination if there are items */}
              {recipes.length > 0 && (
                <div className="mt-3 border-t pt-3 bg-white">
                  <div className="d-flex justify-content-center">
                    <Pagination size="sm">
                      {renderPaginationItems()}
                    </Pagination>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Community;
