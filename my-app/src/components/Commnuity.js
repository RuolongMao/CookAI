import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Badge, Pagination } from 'react-bootstrap';
import "../css/Community.css";
//import DualRangeSlider from './DualRangeSlider';  // Adjust the import path as needed


const RangeInput = ({ title, minValue, maxValue, onRangeChange, unit }) => {
  const [tempMin, setTempMin] = useState(minValue);
  const [tempMax, setTempMax] = useState(maxValue);
  const [minInputValue, setMinInputValue] = useState(minValue.toString());
  const [maxInputValue, setMaxInputValue] = useState(maxValue.toString());
  // 追踪输入框是否被用户编辑过
  const [minTouched, setMinTouched] = useState(false);
  const [maxTouched, setMaxTouched] = useState(false);

  const handleMinChange = (e) => {
    const value = e.target.value;
    setMinTouched(true); // 标记输入框已被编辑
    setMinInputValue(value); // 保存输入值（包括空值）
    const numValue = value === '' ? 0 : Number(value);
    if (numValue >= 0) {
      setTempMin(numValue);
    }
  };

  const handleMaxChange = (e) => {
    const value = e.target.value;
    setMaxTouched(true); // 标记输入框已被编辑
    setMaxInputValue(value); // 保存输入值（包括空值）
    const numValue = value === '' ? 0 : Number(value);
    if (numValue >= 0) {
      setTempMax(numValue);
    }
  };

  const handleMinBlur = () => {
    if (minInputValue === '') {
      setTempMin(0);
      // 如果是编辑后清空，保持空值显示
      if (minTouched) {
        setMinInputValue('');
      } else {
        setMinInputValue('0');
      }
    }

    if (tempMin > tempMax) {
      onRangeChange([tempMin, tempMin]);
      setTempMax(tempMin);
      setMaxInputValue(tempMin.toString());
    } else {
      onRangeChange([tempMin, tempMax]);
    }
  };

  const handleMaxBlur = () => {
    if (maxInputValue === '') {
      setTempMax(0);
      // 如果是编辑后清空，保持空值显示
      if (maxTouched) {
        setMaxInputValue('');
      } else {
        setMaxInputValue('0');
      }
    }

    if (tempMax < tempMin) {
      onRangeChange([tempMax, tempMax]);
      setTempMin(tempMax);
      setMinInputValue(tempMax.toString());
    } else {
      onRangeChange([tempMin, tempMax]);
    }
  };

  // 当 props 更新时，重置所有状态
  useEffect(() => {
    setTempMin(minValue);
    setTempMax(maxValue);
    setMinInputValue(minValue.toString());
    setMaxInputValue(maxValue.toString());
    setMinTouched(false);
    setMaxTouched(false);
  }, [minValue, maxValue]);

  return (
  <div className="mb-3">
    <h6 className="mb-2">{title}</h6>
    <div className="range-input-group">
      <div className="range-input-container">
        <span className="range-input-unit">{unit}</span>
        <input
          type="number"
          min="0"
          value={minInputValue}
          onChange={handleMinChange}
          onBlur={handleMinBlur}
          className="form-control form-control-sm range-input-field"
          placeholder="Min"
        />
      </div>
      <span className="range-separator">to</span>
      <div className="range-input-container">
        <span className="range-input-unit">{unit}</span>
        <input
          type="number"
          min="0"
          value={maxInputValue}
          onChange={handleMaxChange}
          onBlur={handleMaxBlur}
          className="form-control form-control-sm range-input-field"
          placeholder="Max"
        />
      </div>
    </div>
  </div>
  );
};

const Community = () => {
  const [costRange, setCostRange] = useState([0, 100]);
  const [timeRange, setTimeRange] = useState([0, 180]);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  // Recipe data state
  const [recipeData, setRecipeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recipes from backend
  // 修改现有的 useEffect 代码
useEffect(() => {
  const fetchRecipes = async () => {
    const startTime = performance.now();
    
    try {
      console.log('开始获取数据...');
      const response = await fetch('http://localhost:8000/get');
      const endTime = performance.now();
      
      // 打印请求信息
      console.log('请求详情:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        timeMs: Math.round(endTime - startTime)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('获取到的数据:', data);
      
      setRecipeData(data);
      setError(null);
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });
      setError('Failed to load recipes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  fetchRecipes();
}, []); // Empty dependency array means this runs once on component mount

  // Calculate pagination values
  const totalItems = recipeData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page's items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = recipeData.slice(indexOfFirstItem, indexOfLastItem);

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
                <RangeInput
                  title="Cost Range"
                  minValue={costRange[0]}
                  maxValue={costRange[1]}
                  unit="$"
                  onRangeChange={(range) => setCostRange(range)}
                />

                {/* Time Range */}
                <RangeInput
                  title="Cooking Time" 
                  minValue={timeRange[0]}
                  maxValue={timeRange[1]}
                  unit="min"
                  onRangeChange={(range) => setTimeRange(range)}
                />

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
                {isLoading ? (
                  <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Connecting to API...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger m-3" role="alert">
                  <h5>Connection Error</h5>
                  <p>{error}</p>
                  <hr />
                  <div className="mt-3">
                    <h6>Troubleshooting Steps:</h6>
                    <ul>
                      <li>Check if backend server is running (http://localhost:8000)</li>
                      <li>Verify CORS settings in backend</li>
                      <li>Check browser console for detailed error messages</li>
                      <li>Ensure database connection is active</li>
                    </ul>
                  </div>
                </div>
                ) : recipeData.length === 0 ? (
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

              {/* Only show pagination if there are items and not loading */}
              {!isLoading && !error && recipeData.length > 0 && (
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