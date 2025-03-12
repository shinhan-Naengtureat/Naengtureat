import React, {useState} from 'react';
import {Container, Row, Col, Button, InputGroup, FormControl, Badge} from 'react-bootstrap';
import {Search} from 'react-bootstrap-icons';
import "styles/inventory/inventoryList.css";
import IngredientBigCategoryFilter from "components/filter/IngredientBigCategoryFilter";

const InventoryList = () => {
  const categories = ["전체", "과일", "채소", "고기", "수산물", "유제품", "음료", "조미료", "기타", "빵류", "견과류", "곡물"];
  const activeCategory = "채소";

  // 다중 선택을 위한 상태 추가
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 토글 선택 관리
  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(cat => cat !== category) : [...prev, category]
    );
  };

  const items = [
    {id: 1, name: "당근", expiry: "D-10"},
    {id: 2, name: "당근", expiry: "D-10"},
    {id: 3, name: "당근", expiry: "D-10"},
    {id: 4, name: "당근", expiry: "D-10"},
    {id: 5, name: "당근", expiry: "D-10"},
    {id: 6, name: "당근", expiry: "D-10"},
    {id: 7, name: "당근", expiry: "D-10"},
  ];

  return (
    <Container className="inventory-container">
      <IngredientBigCategoryFilter
        items={categories}
        selectedItems={selectedCategories}
        toggleItem={toggleCategory}
      />

      <InputGroup className="mb-4">
        <FormControl placeholder="Search" aria-label="Search" />
        <Button variant="outline-secondary">
          <Search />
        </Button>
      </InputGroup>

      <h5 className="text-start mb-2">| 채소 |</h5>
      <Row className="item-container">
        {items.slice(0, 3).map((item) => (
          <Col xs={4} key={item.id} className="item-box mb-3">
            <Badge pill bg="warning" className="badge.bg-warning mb-1">
              {item.expiry}
            </Badge>
            <div className="border rounded p-2">
              🥕 <img src="https://via.placeholder.com/60" alt="item" className="img-fluid mb-1"/>
              <div>{item.name}</div>
            </div>
          </Col>
        ))}
      </Row>

      <h5 className="text-start mb-2">| 고기 |</h5>
      <Row className="item-container">
        {items.map((item) => (
          <Col xs={4} key={`meat-${item.id}`} className="item-box mb-3">
            <Badge pill bg="warning" className="badge.bg-warning mb-1">
              {item.expiry}
            </Badge>
            <div className="border rounded p-2">
              <img src="https://via.placeholder.com/60" alt="item" className="img-fluid mb-1"/>
              <div>{item.name}</div>
            </div>
          </Col>
        ))}
      </Row>

      <Button
        variant="warning"
        className="rounded-circle position-fixed"
        style={{bottom: "90px", right: "30px", width: "50px", height: "50px"}}
      >
        +
      </Button>
    </Container>
  );
};

export default InventoryList;