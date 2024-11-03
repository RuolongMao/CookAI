import React from 'react';
import { Container, Row, Col, Form, Card, Badge, Pagination } from 'react-bootstrap';
import "../css/Community.css";

const Community = () => {
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
                <div className="recipe-grid">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card key={item} className="recipe-card">
                      <Card.Img 
                        variant="top" 
                        src="/api/placeholder/400/300"
                        alt="Recipe" 
                        className="recipe-card-img"
                      />
                      <Card.Body className="recipe-card-body">
                        <Card.Title className="h5">Recipe Name {item}</Card.Title>
                        <Card.Text className="text-muted small">
                          Published: Jan {item}, 2024
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pagination - Fixed at Bottom */}
              <div className="mt-3 border-t pt-3 bg-white">
                <div className="d-flex justify-content-center">
                  <Pagination size="sm">
                    <Pagination.First />
                    <Pagination.Prev />
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Item active>{2}</Pagination.Item>
                    <Pagination.Item>{3}</Pagination.Item>
                    <Pagination.Next />
                    <Pagination.Last />
                  </Pagination>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Community;