import React, {useEffect, useState} from 'react';
import axiosInstance from "api/axios";
import {API_PATH} from "config/pathConfig";
import {Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {useParams} from "react-router-dom";
import "styles/inventory/inventoryDetail.css";

const InventoryDetail = () => {
  const {id} = useParams();
  const [inventory, setinventory] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [bigCategories, setBigCategories] = useState([]);
  // const [smallCategories, setSmallCategories] = useState([]);


  useEffect(() => {
    axiosInstance.get(`${API_PATH}/inventory/${id}`)
      .then(response => {
        console.log(response.data);
        setinventory(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log("재료 정보를 불러오는 중 오류 발생: ", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Spinner animation="border"/>;
  }

  if (!inventory) {
    return <Container>해당 재료 정보를 찾을 수 없습니다.</Container>;
  }

  return (
    <Container className="inventory-detail-container">

      {/* 이미지 & 분류 */}
      <Row className="image-category-row">
        <Col xs={3} className="image-box">
          <img src="/images/potato.png" alt="재료 이미지" className="inventory-image"/>
        </Col>
        <Col xs={9} className="category-box">
          <Row className="align-items-center">
            {/* 대분류 */}
            <Col xs={6} className="text-center">
              <Form.Label className="category-label">대분류</Form.Label>
              <Form.Select className="category-select">
                <option>{inventory.ingredientBigCategory}</option>
              </Form.Select>
            </Col>
            {/* 소분류 */}
            <Col xs={6} className="text-center">
              <Form.Label className="category-label">소분류</Form.Label>
              <Form.Select className="category-select">
                <option>{inventory.ingredientSmallCategory}</option>
              </Form.Select>
            </Col>
          </Row>
          {/* 닉네임 입력 */}
          <Form.Control type="text" defaultValue={inventory.nickName} className="nickname-input"/>
        </Col>
      </Row>

      {/* 수량 조절 */}
      <Row className="quantity-row">
        <Col xs={4} className="quantity-button">
          <Button variant="outline-danger">－</Button>
        </Col>
        <Col xs={4} className="quantity-value">
          {inventory.quantity}
        </Col>
        <Col xs={4} className="quantity-button">
          <Button variant="outline-primary">＋</Button>
        </Col>
      </Row>

      {/* 날짜 입력 (yyyy-MM-dd 포맷 적용) */}
      <Row className="date-group">
        <Col xs={6} className="date-item">
          <Form.Label className="date-label">인입일</Form.Label>
          <Form.Control
            type="date"
            defaultValue={inventory.inputDate}
            className="date-input"
          />
        </Col>
        <Col xs={6} className="date-item">
          <Form.Label className="date-label">소비기한</Form.Label>
          <Form.Control
            type="date"
            defaultValue={inventory.inventoryExpDate}
            className="date-input"
          />
        </Col>
      </Row>

      {/* 메모 입력 */}
      <Form.Control as="textarea" placeholder="탭해서 메모 남기기" className="memo-input"/>

      {/* 추가 버튼 */}
      <Button variant="warning" className="add-button">추가</Button>
    </Container>
  );
};

export default InventoryDetail;