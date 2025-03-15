import React, {useEffect, useState} from 'react';
import axiosInstance from "api/axios";
import {Button, Col, Container, Form, Modal, Row, Spinner} from "react-bootstrap";
import {useParams} from "react-router-dom";
import "styles/inventory/inventoryDetail.css";
import {INGREDIENT_IMAGE_PATH} from "config/pathConfig";

const InventoryDetail = () => {
  const {id} = useParams();
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bigCategories, setBigCategories] = useState([]); // 대분류 목록
  const [smallCategories, setSmallCategories] = useState({}); // 대분류별 소분류 매핑
  const [selectedBigCategory, setSelectedBigCategory] = useState(""); // 선택된 대분류
  const [filteredSmallCategories, setFilteredSmallCategories] = useState([]); // 선택된 대분류에 따른 소분류 목록
  const [selectedSmallCategory, setSelectedSmallCategory] = useState(""); // 선택된 소분류
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [integerPart, setIntegerPart] = useState(0);  // 정수 부분
  const [fractionPart, setFractionPart] = useState(0); // 소수 부분
  const [ingredientUnit, setIngredientUnit] = useState("");  // 재료 단위 저장

  useEffect(() => {
    axiosInstance.get(`/inventory/${id}`)
      .then(response => {
        setInventory(response.data);
        setSelectedBigCategory(response.data.ingredientBigCategory);
        setSelectedSmallCategory(response.data.ingredientSmallCategory);
        setLoading(false);

        // ingredientUnit 가져오기
        axiosInstance.get(`/ingredient/categories`)
          .then(categoryResponse => {
            const matchedCategory = categoryResponse.data.find(item => item.smallCategory === response.data.ingredientSmallCategory);
            if (matchedCategory) {
              setIngredientUnit(matchedCategory.ingredientUnit);
            }
          })
          .catch(error => console.log("카테고리 목록 불러오기 실패:", error));
      })
      .catch(error => {
        console.log("재료 정보를 불러오는 중 오류 발생: ", error);
        setLoading(false);
      });

    axiosInstance.get(`/ingredient/categories`)
      .then(response => {
        const uniqueBigCategories = [...new Set(response.data.map(item => item.bigCategory))];
        setBigCategories(uniqueBigCategories);

        const groupedSmallCategories = response.data.reduce((acc, item) => {
          if (!acc[item.bigCategory]) {
            acc[item.bigCategory] = [];
          }
          acc[item.bigCategory].push({
            smallCategory: item.smallCategory,
            ingredientStandardImage: item.standardImage
          });
          return acc;
        }, {});
        setSmallCategories(groupedSmallCategories);
      })
      .catch(error => console.log("카테고리 목록 불러오기 실패: ", error));
  }, [id]);

  useEffect(() => {
    if (inventory && ingredientUnit === "개") {
      const quantity = inventory.quantity;
      setIntegerPart(Math.floor(quantity));
      setFractionPart(quantity - Math.floor(quantity));
    }
  }, [inventory, ingredientUnit]);

  useEffect(() => {
    if (selectedBigCategory) {
      setFilteredSmallCategories(smallCategories[selectedBigCategory] || []);
      setSelectedSmallCategory("");
    } else {
      setFilteredSmallCategories([]);
    }
  }, [selectedBigCategory, smallCategories]);

  if (loading) {
    return <Spinner animation="border"/>;
  }

  if (!inventory) {
    return <Container>해당 재료 정보를 찾을 수 없습니다.</Container>;
  }

  return (
    <Container className="inventory-detail-container">
      <h2 className="ingredient-detail-title">재료 상세 정보</h2>
      {/* 이미지 & 분류 */}
      <Row className="image-category-row">
        <Col xs={3} className="image-box">
          <img src={`${INGREDIENT_IMAGE_PATH}/${filteredSmallCategories.find(
            (category) => category.smallCategory === selectedSmallCategory
          )?.ingredientStandardImage || "default.png"}`}
               alt="재료 이미지"
               className="inventory-image"
          />
        </Col>
        <Col xs={9} className="category-box">
          <Row className="align-items-center">
            {/* 대분류 */}
            <Col xs={6} className="text-center">
              <Form.Label className="category-label">대분류</Form.Label>
              <Form.Select
                className="category-select"
                value={selectedBigCategory}
                onChange={(e) => setSelectedBigCategory(e.target.value)}
              >
                <option value="">대분류 선택</option>
                {bigCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
            {/* 소분류 */}
            <Col xs={6} className="text-center">
              <Form.Label className="category-label">소분류</Form.Label>
              <Form.Control
                className="category-select"
                value={selectedSmallCategory}
                readOnly
                onClick={() => setIsModalOpen(true)} // 클릭 시 모달 열기
              />
            </Col>
            {/* 닉네임 입력 */}
            <Col>
              <Form.Control type="text" defaultValue={inventory.nickName} className="nickname-input"/>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 모달 (소분류 선택) */}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>소분류 선택</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {filteredSmallCategories.map((category, index) => (
              <Col xs={4} key={index} className="text-center">
                <Button
                  variant="light"
                  onClick={() => {
                    setSelectedSmallCategory(category.smallCategory);
                    setIsModalOpen(false); // 선택 후 모달 닫기
                  }}
                  className="category-btn"
                >
                  <img
                    src={`${INGREDIENT_IMAGE_PATH}/${category.ingredientStandardImage}`}
                    alt={category}
                    className="category-icon"
                  />
                  <div>{category.smallCategory}</div>
                </Button>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>

      <h3 className="ingredient-detail-sub-title">개수</h3>
      {/* 수량 조절 (정수 + 소수 부분을 가로로 배치) */}
      <Row className="quantity-row align-items-center">
        {/* 정수 부분 */}
        <Col xs={6} className="d-flex align-items-center">
          <Button variant="outline-danger" onClick={() => setIntegerPart(prev => Math.max(prev - 1, 0))}>－</Button>
          <Form.Control
            type="number"
            value={integerPart}
            onChange={(e) => setIntegerPart(Math.max(0, parseInt(e.target.value) || 0))}
            className="mx-2 text-center"
            style={{width: "50px"}}
          />
          <Button variant="outline-primary" onClick={() => setIntegerPart(prev => prev + 1)}>＋</Button>
        </Col>

        {/* 소수 부분 (ingredientUnit이 "개"일 때만 표시) */}
        {ingredientUnit === "개" && (
          <Col xs={4}>
            <Form.Select value={fractionPart} onChange={(e) => setFractionPart(parseFloat(e.target.value))}>
              <option value={0.0}>0</option>
              <option value={0.25}>1/4</option>
              <option value={0.5}>2/4</option>
              <option value={0.75}>3/4</option>
            </Form.Select>
          </Col>
        )}
        <Col xs={2}>개</Col>
      </Row>

      {/* 날짜 입력 */}
      <Row className="date-group">
        <Col xs={6} className="date-item">
          <Form.Label className="date-label">인입일</Form.Label>
          <Form.Control type="date" defaultValue={inventory.inputDate} className="date-input"/>
        </Col>
        <Col xs={6} className="date-item">
          <Form.Label className="date-label">소비기한</Form.Label>
          <Form.Control type="date" defaultValue={inventory.inventoryExpDate} className="date-input"/>
        </Col>
      </Row>

      {/* 메모 입력 */}
      <h3 className="ingredient-detail-sub-title">메모</h3>
      <Form.Control as="textarea" placeholder="탭해서 메모 남기기" className="memo-input"/>

      {/* 추가 버튼 */}
      <Button variant="warning" className="add-button">등록</Button>
    </Container>
  )
    ;
};

export default InventoryDetail;