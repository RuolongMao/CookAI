import React from 'react';
import { Container, Row, Col, Form, Card, Badge, Pagination } from 'react-bootstrap';

const Community = () => {
  return (
    <Container fluid className="py-4">
      <Row>
        {/* Left Section - Search and Filters */}
        <Col md={3} className="mb-4">
          {/* Search Bar */}
          <div className="position-relative mb-4">
            <Form.Control
              type="search"
              placeholder="Search recipes..."
              className="pe-5"
            />
            <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-2 text-muted"></i>
          </div>

          {/* Filter Panel */}
          <div className="bg-white p-3 rounded shadow-sm">
            <h5 className="mb-3">Filters</h5>
            
            {/* Taste Filter */}
            <div className="mb-4">
              <h6 className="mb-2">Taste</h6>
              {['Sweet', 'Sour', 'Salty', 'Spicy'].map(taste => (
                <Form.Check
                  key={taste}
                  type="checkbox"
                  label={taste}
                  className="mb-2"
                />
              ))}
            </div>

            {/* Vegan Option */}
            <div className="mb-4">
              <h6 className="mb-2">Dietary</h6>
              <Form.Check
                type="checkbox"
                label="Vegan"
                className="mb-2"
              />
            </div>

            {/* Cost Range */}
            <div className="mb-4">
              <h6 className="mb-2">Cost Range</h6>
              <Form.Range min={0} max={100} />
              <div className="d-flex justify-content-between">
                <small>$0</small>
                <small>$100</small>
              </div>
            </div>

            {/* Time Range */}
            <div className="mb-4">
              <h6 className="mb-2">Cooking Time (minutes)</h6>
              <Form.Range min={0} max={180} />
              <div className="d-flex justify-content-between">
                <small>0 min</small>
                <small>180 min</small>
              </div>
            </div>

            {/* Selected Filters */}
            <div>
              <h6 className="mb-2">Selected Filters</h6>
              <Badge bg="secondary" className="me-2 mb-2">
                Sweet ×
              </Badge>
              <Badge bg="secondary" className="me-2 mb-2">
                Vegan ×
              </Badge>
              <Badge bg="secondary" className="me-2 mb-2">
                &lt; 60 min ×
              </Badge>
            </div>
          </div>
        </Col>

        {/* Right Section - Recipe Grid */}
        <Col md={9}>
          <Row className="g-4">
            {/* Recipe Cards */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Col key={item} md={4}>
                <Card className="h-100 shadow-sm">
                  <Card.Img 
                    variant="top" 
                    src="/api/placeholder/400/300"
                    alt="Recipe" 
                  />
                  <Card.Body>
                    <Card.Title>Recipe Name</Card.Title>
                    <Card.Text className="text-muted">
                      Published: Jan 1, 2024
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Community;