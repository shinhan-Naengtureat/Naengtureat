import React, {useEffect, useMemo, useState} from 'react';
import {Container, Row, Col, Button, InputGroup, FormControl, Badge, Placeholder} from 'react-bootstrap';
import {Search} from 'react-bootstrap-icons';
import "styles/inventory/inventoryList.css";
import IngredientBigCategoryFilter from "components/filter/IngredientBigCategoryFilter";
import axios from "axios";
import {API_PATH} from "config/pathConfig";

const InventoryList = () => {
  // 다중 선택을 위한 상태 추가
  const [selectedCategories, setSelectedCategories] = useState(["전체"]);
  const [rawItems, setRawItems] = useState();
  const [loading, setLoading] = useState(true);

  //아이템 useEffect
  useEffect(() => {
    let ignore = false;

    console.time("Data Fetching & Processing");
    axios.get(`${API_PATH}/inventory`)
      .then(response => {
        if (!ignore) {
          console.log(response);
          const extractedItems = response.data.map(item => ({
            id: item.id,
            nickName: item.nickName,
            remainingDays: item.remainingDays,
            ingredientBigCategory: item.ingredientBigCategory
          }));
          setRawItems(extractedItems);
          setLoading(false); // 데이터 로딩 완료
          console.timeEnd("Data Fetching & Processing");
        }
      })
      .catch(error => {
        console.log("데이터를 가져오는 중 에러 발생: " + error);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  //카테고리 목록 동적 생성
  const categories = useMemo(() => {
    if (!rawItems) return ["전체"];
    console.log(rawItems);
    const uniqueCategories = Array.from(
      new Set(rawItems.map(item => item.ingredientBigCategory))
    );
    return ["전체", ...uniqueCategories];
  }, [rawItems]);

  //필터링된 아이템 리스트
  const filteredItems = useMemo(() => {
    if (!selectedCategories.length || selectedCategories.includes("전체")) return rawItems;
    return rawItems.filter(item => selectedCategories.includes(item.ingredientBigCategory));
  }, [rawItems, selectedCategories]);

  const groupedItems = useMemo(() => {
    return (filteredItems || [ ]).reduce((acc, item) => {
      if (!acc[item.ingredientBigCategory]) {
        acc[item.ingredientBigCategory] = [ ];
      }
      acc[item.ingredientBigCategory].push(item);
      return acc;
    }, {});
  }, [filteredItems]);

  // 전체 선택 시 다른 카테고리 해제 & 중복 선택 방지
  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (category === "전체") {
        return prev.includes("전체") ? prev : ["전체"];
      }
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      }
      return prev.includes("전체") ? [category] : [...prev, category];
    });
  };

  // //아이템 useMemo
  // const items = useMemo(() => {
  //   return (rawItems || []).map(item => ({
  //     id: item.id,
  //     nickName: item.nickName,
  //     remainingDays: item.remainingDays,
  //     ingredientBigCategory: item.ingredientBigCategory
  //   }));
  // }, [JSON.stringify(rawItems)]);


  return (
    <Container className="inventory-container">
      {/*category filter*/}
      <IngredientBigCategoryFilter
        items={categories}
        selectedItems={selectedCategories}
        toggleItem={toggleCategory}
      />

      {/*검색 입력창*/}
      <InputGroup className="mb-4">
        <FormControl placeholder="Search" aria-label="Search"/>
        <Button variant="outline-secondary">
          <Search/>
        </Button>
      </InputGroup>

      {/* 데이터 로딩 중일 때 Placeholder 표시 */}
      {loading ? (
        <Row className="item-container">
          {[...Array(6)].map((_, index) => (
            <Col xs={4} key={index} className="item-box mb-3">
              <Placeholder as="div" animation="wave">
                <Placeholder xs={12} className="bg-warning mb-1" style={{ height: "20px", borderRadius: "10px" }} />
                <div className="border rounded p-2">
                  <Placeholder xs={6} className="mb-1" />
                  <Placeholder xs={8} />
                </div>
              </Placeholder>
            </Col>
          ))}
        </Row>
      ) : (
        Object.keys(groupedItems).map((category) => (
          <div key={category}>
            <h5 className="text-start mb-2">| {category} |</h5>
            <Row className="item-container">
              {groupedItems[category].map((item) => (
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
          </div>
        ))
      )}


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