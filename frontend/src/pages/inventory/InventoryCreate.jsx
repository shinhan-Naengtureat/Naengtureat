import React, {useEffect, useState} from 'react';
import axiosInstance from "api/axios";
import {Button, Col, Container, Form, Modal, Row, Spinner} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import "styles/inventory/inventoryDetail.css";
import {INGREDIENT_IMAGE_PATH} from "config/pathConfig";
import {toast, ToastContainer} from "react-toastify";

const InventoryCreate = () => {
  const [bigCategories, setBigCategories] = useState([]); // 대분류 목록
  const [smallCategories, setSmallCategories] = useState({}); // 대분류별 소분류 매핑
  const [selectedBigCategory, setSelectedBigCategory] = useState(""); // 선택된 대분류
  const [filteredSmallCategories, setFilteredSmallCategories] = useState([]); // 선택된 대분류에 따른 소분류 목록
  const [selectedSmallCategory, setSelectedSmallCategory] = useState(""); // 선택된 소분류
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [integerPart, setIntegerPart] = useState(0);  // 정수 부분
  const [fractionPart, setFractionPart] = useState(0); // 소수 부분
  const [ingredientUnit, setIngredientUnit] = useState("");  // 재료 단위 저장

  const [nickName, setNickName] = useState("");
  const [memo, setMemo] = useState("");
  const [inventoryExpDate, setInventoryExpDate] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [ingredientId, setIngredientId] = useState(null);
  const [standardExpDate, setStandardExpDate] = useState(0); // 소비기한 기준

  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
  const navigate = useNavigate();

  // 오늘 날짜 가져오기 함수
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // 대분류 및 소분류 데이터 가져오기
  useEffect(() => {
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
            ingredientStandardImage: item.standardImage,
            ingredientId: item.ingredientId,
            standardExpDate: item.standardExpDate
          });
          return acc;
        }, {});
        setSmallCategories(groupedSmallCategories);

        // 대분류가 선택되지 않았을 경우, 기본값을 "채소"로 설정
        if (!selectedBigCategory && groupedSmallCategories["채소"]) {
          setSelectedBigCategory("채소");

          // "채소"의 첫 번째 소분류를 기본 선택
          const firstSmallCategory = groupedSmallCategories["채소"][0];
          if (firstSmallCategory) {
            setSelectedSmallCategory(firstSmallCategory.smallCategory);
            setIngredientId(firstSmallCategory.ingredientId);
            setNickName(firstSmallCategory.smallCategory);
            setStandardExpDate(firstSmallCategory.standardExpDate);
          }
        }
      })
      .catch(error => console.log("카테고리 목록 불러오기 실패: ", error));
  }, []);

  // 기본적으로 inputDate를 오늘 날짜로 설정
  useEffect(() => {
    setInputDate(getTodayDate());
  }, []);

  // 선택된 대분류가 변경될 때 처리
  useEffect(() => {
    if (selectedBigCategory && smallCategories[selectedBigCategory]) {
      const newFilteredCategories = smallCategories[selectedBigCategory];
      setFilteredSmallCategories(newFilteredCategories);

      if (newFilteredCategories.length > 0) {
        setSelectedSmallCategory(newFilteredCategories[0].smallCategory);
        setIngredientId(newFilteredCategories[0].ingredientId);
        setNickName(newFilteredCategories[0].smallCategory);
        setStandardExpDate(newFilteredCategories[0].standardExpDate);
      }
    }
  }, [selectedBigCategory, smallCategories]);

  // 소분류 변경 시 소비기한 자동 설정
  useEffect(() => {
    if (selectedSmallCategory && typeof standardExpDate === "number") {
      const today = new Date();
      today.setDate(today.getDate() + standardExpDate);
      setInventoryExpDate(today.toISOString().split("T")[0]);
    }
  }, [selectedSmallCategory, standardExpDate]);

  // 소분류 선택 핸들러
  const handleSelectSmallCategory = (category) => {
    setSelectedSmallCategory(category.smallCategory);
    setIngredientId(category.ingredientId);
    setNickName(category.smallCategory);
    setStandardExpDate(category.standardExpDate);
    setIsModalOpen(false);
  };

  // 소분류 선택 시 ingredientUnit 업데이트
  useEffect(() => {
    if (selectedSmallCategory) {
      axiosInstance.get(`/ingredient/categories`)
        .then(response => {
          const matchedCategory = response.data.find(item => item.smallCategory === selectedSmallCategory);
          if (matchedCategory) {
            setIngredientUnit(matchedCategory.ingredientUnit);
          }
        })
        .catch(error => console.log("재료 단위 불러오기 실패:", error));
    }
  }, [selectedSmallCategory]);

  // 재료 등록 요청
  const handleCreateInventory = () => {
    if (!ingredientId) {
      alert("재료 ID가 없습니다.");
      return;
    }

    if (integerPart + fractionPart === 0) {
      toast.error("0개는 등록할 수 없어요!")
      return;
    }

    const newInventory = {
      quantity: integerPart + fractionPart,
      nickName,
      memo,
      inventoryExpDate,
      inputDate,
      memberId: 3,
      ingredientId,
      ingredientBigCategory: selectedBigCategory,
      ingredientSmallCategory: selectedSmallCategory
    };

    axiosInstance.post("/inventory/new", newInventory)
      .then(() => {
        navigate("/inventory");
      })
      .catch(error => {
        console.error("재료 등록 중 오류 발생:", error);
        alert("등록 중 오류가 발생했습니다.");
      });
  };

  // 검색어 입력 시 실시간 필터링
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (selectedBigCategory) {
      const newFilteredCategories = smallCategories[selectedBigCategory].filter(category =>
        category.smallCategory.toLowerCase().includes(query)
      );
      setFilteredSmallCategories(newFilteredCategories);
    }
  };

  const handleChangeIntegerPart = (e) => {
    const value = e.target.value;
    // 빈 값이 들어오면 그대로 유지 (0으로 강제하지 않음)
    if (value === "") {
      setIntegerPart("");
    } else {
      setIntegerPart(Math.max(0, parseInt(value, 10) || 0));
    }
  };


  return (
    <Container className="inventory-detail-container">
      <ToastContainer/>
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
              {/* 대분류 선택 */}
              <Form.Select
                className="category-select"
                value={selectedBigCategory}
                onChange={(e) => setSelectedBigCategory(e.target.value)}>
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
                value={selectedSmallCategory} readOnly
                onClick={() => setIsModalOpen(true)}/>
            </Col>
            {/* 닉네임 입력 */}
            <Col>
              <Form.Control
                type="text"
                value={nickName}
                className="nickname-input"
                onChange={(e) => setNickName(e.target.value)}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 모달 (소분류 선택) */}
      <Modal show={isModalOpen}
             onHide={() => setIsModalOpen(false)}
             centered
             className="small-category-modal"
      >
        <Modal.Header closeButton>
          {/* 검색 입력창 */}
          <div className="search-container">
            <input
              type="text"
              placeholder="찾고싶은 재료를 검색해주세요 🔍"
              className="search-input"
              value={searchQuery}
              onChange={handleSearch} // 입력 시 실시간 필터링
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="small-category-list">
            <Row className={`filtered-row ${filteredSmallCategories.length <= 2 ? "few-results" : ""}`}>
              {filteredSmallCategories.length > 0 ? (
                filteredSmallCategories.map((category, index) => (
                  <Col xs={4} key={index} className="text-center category-col">
                    <Button
                      variant="light"
                      onClick={() => handleSelectSmallCategory(category)}
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
                ))
              ) : (
                <div className="no-results">검색결과가 없습니다</div>
              )}
            </Row>
          </div>
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
            value={integerPart === 0 ? 1 : integerPart} // 빈 값 유지
            onChange={handleChangeIntegerPart} // 새로운 핸들러 사용
            className="mx-2 text-center"
            style={{width: "50px"}}
          />
          <Button variant="outline-primary" onClick={() => setIntegerPart(prev => prev + 1)}>＋</Button>
        </Col>

        {/* 소수 부분 (ingredientUnit이 "개"일 때만 표시) */}
        {ingredientUnit === "개" && (
          <Col xs={4}>
            <Form.Select
              value={fractionPart}
              onChange={(e) => setFractionPart(parseFloat(e.target.value))}
            >
              <option value={0.0}>0</option>
              <option value={0.25}>1/4</option>
              <option value={0.5}>2/4</option>
              <option value={0.75}>3/4</option>
            </Form.Select>
          </Col>
        )}
        <Col xs={2}>{ingredientUnit}</Col>
      </Row>

      {/* 날짜 입력 */}
      <Row className="date-group">
        <Col xs={6} className="date-item">
          <Form.Label className="date-label">인입일</Form.Label>
          <Form.Control type="date"
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
          />
        </Col>
        <Col xs={6} className="date-item">
          <Form.Label className="date-label">소비기한</Form.Label>
          <Form.Control type="date"
                        value={inventoryExpDate}
                        onChange={(e) => setInventoryExpDate(e.target.value)}/>
        </Col>
      </Row>

      {/* 메모 입력 */}
      <h3 className="ingredient-detail-sub-title">메모</h3>
      <Form.Control
        as="textarea"
        placeholder="탭해서 메모 남기기"
        className="memo-input"
        onChange={(e) => setMemo(e.target.value)}
      />

      {/* 추가 버튼 */}
      <Button variant="warning" className="add-button" onClick={handleCreateInventory}>
        등록
      </Button>
    </Container>
  )
    ;
};

export default InventoryCreate;