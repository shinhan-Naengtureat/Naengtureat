import React, {useEffect, useMemo, useState} from 'react';
import {Container, Row, Col, Button, InputGroup, FormControl, Badge} from 'react-bootstrap';
import {Search} from 'react-bootstrap-icons';
import "styles/inventory/inventoryList.css";
import IngredientBigCategoryFilter from "components/filter/IngredientBigCategoryFilter";
import axios from "axios";
import {CONTEXT_PATH} from "config/pathConfig";

const InventoryList = () => {
  //todo: 카테고리는 내 인벤토리에 있는 재료 중 bigCategory 로 구성하기
  const categories = ["전체", "과일", "채소", "고기", "수산물", "유제품", "음료", "조미료", "기타", "빵류", "견과류", "곡물"];
  const activeCategory = "채소";

  // 다중 선택을 위한 상태 추가
  const [selectedCategories, setSelectedCategories] = useState([ ]);

  // 토글 선택 관리
  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(cat => cat !== category) : [...prev, category]
    );
  };

  //todo: inventory에 있는 재료의 nickname과 expirydate 가져오기
  const [rawItems, setRawItems] = useState();
  useEffect(() => {
    let ignore = false;

    console.time("Data Fetching & Processing"); // 실행 시간 측정 시작
    axios.get(`${CONTEXT_PATH}/inventory`)
      .then(response => {
        if (!ignore) {  // 첫 번째 실행 때만 데이터를 설정
          setRawItems(response.data || []);
          const extractedItems = response.data.map(item => ({
            id: item.id,
            nickName: item.nickName,
            remainingDays: item.remainingDays
          }));
          setRawItems(extractedItems);
          console.timeEnd("Data Fetching & Processing"); // 실행 시간 측정 종료
        }
      })
      .catch(error => {
        console.log("데이터를 가져오는 중 에러 발생: " + error);
      });
    return () => {
      ignore = true;
    }
  }, []);

  const items = useMemo(() => {
    return (rawItems || []).map(item => ({
      id: item.id,
      nickName: item.nickName,
      remainingDays: item.remainingDays
    }));
  }, [JSON.stringify(rawItems)]);

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
        {(items || []).map((item) => (
          <Col xs={4} key={item.id} className="item-box mb-3">
            <Badge pill bg="warning" className="badge.bg-warning mb-1">
              {item.remainingDays}
            </Badge>
            <div className="border rounded p-2">
              🥕 <img src="" alt="item" className="img-fluid mb-1"/>
              <div>{item.nickName}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/*<h5 className="text-start mb-2">| 고기 |</h5>*/}
      {/*<Row className="item-container">*/}
      {/*  {items.map((item) => (*/}
      {/*    <Col xs={4} key={`meat-${item.id}`} className="item-box mb-3">*/}
      {/*      <Badge pill bg="warning" className="badge.bg-warning mb-1">*/}
      {/*        {item.expiry}*/}
      {/*      </Badge>*/}
      {/*      <div className="border rounded p-2">*/}
      {/*        <img src="https://via.placeholder.com/60" alt="item" className="img-fluid mb-1"/>*/}
      {/*        <div>{item.nickName}</div>*/}
      {/*      </div>*/}
      {/*    </Col>*/}
      {/*  ))}*/}
      {/*</Row>*/}

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