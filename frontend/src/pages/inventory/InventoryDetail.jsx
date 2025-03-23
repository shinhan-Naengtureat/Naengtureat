import React, {useEffect, useRef, useState} from 'react';
import axiosInstance from "api/axios";
import {Button, Col, Container, Form, Modal, Row, Spinner} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import "styles/inventory/inventoryDetail.css";
import {INGREDIENT_IMAGE_PATH} from "config/pathConfig";
import {toast, ToastContainer} from "react-toastify";
import routeConfig from "routes/routeConfig";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 모달 상태 추가
  const [integerPart, setIntegerPart] = useState(0);  // 정수 부분
  const [fractionPart, setFractionPart] = useState(0); // 소수 부분
  const [ingredientUnit, setIngredientUnit] = useState("");  // 재료 단위 저장
  const [ingredientBigCategory, setIngredientBigCategory] = useState("");
  const [ingredientSmallCategory, setIngredientSmallCategory] = useState("");

  const [nickName, setNickName] = useState("");
  const [memo, setMemo] = useState("");
  const [inventoryExpDate, setInventoryExpDate] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [ingredientId, setIngredientId] = useState(null);

  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
  const navigate = useNavigate();
  const sectionRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        setTimeout(() => {
          ref.classList.add("visible");
        }, index * 200);
      }
    });
  }, []);

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
            ingredientStandardImage: item.standardImage,
            ingredientId: item.ingredientId
          });
          return acc;
        }, {});
        setSmallCategories(groupedSmallCategories);
      })
      .catch(error => console.log("카테고리 목록 불러오기 실패: ", error));
  }, [id]);

  useEffect(() => {
    if (inventory) {
      if (ingredientUnit === "개") {
        const quantity = inventory.quantity;
        setIntegerPart(Math.floor(quantity));
        setFractionPart(quantity - Math.floor(quantity));
      } else {
        setIntegerPart(inventory.quantity); // 개가 아닐 때도 quantity 설정
        setFractionPart(0); // 개가 아닐 경우 소수 부분은 0으로 설정
      }
    }
  }, [inventory, ingredientUnit]);

  //inventory가 있으면 기존 것, 없으면 해당 대분류의 소분류 1번쨰로 자동 지정
  useEffect(() => {
    if (selectedBigCategory && smallCategories[selectedBigCategory]?.length > 0) {
      const firstSmallCategory = smallCategories[selectedBigCategory][0];

      if (!inventory) {
        // 대분류 변경 시 즉시 첫 번째 소분류 적용 (기존 데이터 무시)
        setSelectedSmallCategory(firstSmallCategory.smallCategory);
        setIngredientId(firstSmallCategory.ingredientId);
        setNickName(firstSmallCategory.smallCategory);
      } else if (selectedBigCategory !== inventory.ingredientBigCategory) {
        // 대분류 변경 시, inventory 값과 다르면 즉시 반영
        setSelectedSmallCategory(firstSmallCategory.smallCategory);
        setIngredientId(firstSmallCategory.ingredientId);
        setNickName(firstSmallCategory.smallCategory);
      } else {
        // 기존 데이터가 있을 경우 유지 (지연 로딩)
        setTimeout(() => {
          setSelectedSmallCategory(inventory.ingredientSmallCategory);
          setIngredientId(inventory.ingredientId);
          setNickName(inventory.nickName);
        }, 100);
      }
    }
  }, [selectedBigCategory, smallCategories, inventory]);

  // 소분류 변경 시 해당하는 ingredientUnit을 찾아서 자동으로 업데이트
  useEffect(() => {
    if (selectedSmallCategory) {
      axiosInstance.get(`/ingredient/categories`)
        .then(response => {
          const matchedCategory = response.data.find(item => item.smallCategory === selectedSmallCategory);
          if (matchedCategory) {
            setIngredientUnit(matchedCategory.ingredientUnit); // ingredientUnit 업데이트
          }
        })
        .catch(error => console.log("재료 단위 불러오기 실패:", error));
    }
  }, [selectedSmallCategory]);

  // 소분류 선택 시 nickName 자동 입력
  const handleSelectSmallCategory = (category) => {
    console.log("선택한 소분류:", category.smallCategory);
    console.log("해당 재료 ID:", category.ingredientId);

    setSelectedSmallCategory(category.smallCategory);
    setIngredientId(category.ingredientId);
    setNickName(category.smallCategory);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedBigCategory) {
      const newFilteredCategories = smallCategories[selectedBigCategory] || [];
      setFilteredSmallCategories(newFilteredCategories);

      // 대분류 선택 시 첫 번째 소분류 자동 선택
      if (newFilteredCategories.length > 0) {
        setSelectedSmallCategory(newFilteredCategories[0].smallCategory);
        setIngredientId(newFilteredCategories[0].ingredientId);
        setNickName(newFilteredCategories[0].smallCategory);
      }
    } else {
      setFilteredSmallCategories([]);
    }
  }, [selectedBigCategory, smallCategories]);

  useEffect(() => {
    if (inventory) {
      setNickName(inventory.nickName || "");
      setMemo(inventory.memo || "");
      setInventoryExpDate(inventory.inventoryExpDate || "");
      setInputDate(inventory.inputDate || "");
      setIngredientId(inventory.ingredientId || null);
      setIngredientBigCategory(inventory.ingredientBigCategory || "");
      setIngredientSmallCategory(inventory.ingredientSmallCategory || "");
    }
  }, [inventory]);

  useEffect(() => {
    if (ingredientUnit !== "개") {
      setFractionPart(0); // 개가 아닐 경우 fractionPart를 0으로 초기화
    }
  }, [ingredientUnit]);

  const handleUpdateInventory = () => {
    if (!ingredientId) {
      alert("재료 ID가 없습니다.");
      return;
    }

    if (integerPart + fractionPart === 0) {
      toast.error("0개는 등록할 수 없어요!")
      return;
    }

    const updatedInventory = {
      id: inventory.id,
      quantity: integerPart + fractionPart,
      nickName,
      memo,
      inventoryExpDate,
      inputDate,
      memberId: 3,  // 회원 ID (임시 값)
      ingredientId,
      ingredientBigCategory,
      ingredientSmallCategory
    };

    axiosInstance.put("/inventory", updatedInventory)
      .then(response => {
        navigate(routeConfig.paths.inventoryList);
      })
      .catch(error => {
        console.error("재료 수정 중 오류 발생:", error);
        alert("수정 중 오류가 발생했습니다.");
      });
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

  //삭제 핸들러
  const handleDeleteInventory = () => {
    if (!inventory?.id) {
      toast.error("삭제할 재료가 없습니다."); // 토스트 오류 메시지
      return;
    }

    setIsDeleteModalOpen(true); // 모달 열기
  };

  const confirmDelete = () => {
    axiosInstance
      .delete(`/inventory/${inventory.id}`)
      .then(() => {
        const message = `${inventory.nickName} 삭제 완료!`;

        setTimeout(() => {
          toast.success(message); // 이제 정확한 메시지가 표시됨
        }, 300);

        navigate(routeConfig.paths.inventoryList);
      })
      .catch(error => {
        console.error("재료 삭제 중 오류 발생:", error);
        toast.error("삭제 중 오류 발생!!");
      })
      .finally(() => {
        setIsDeleteModalOpen(false); // 모달 닫기
      });
  };

  if (loading) {
    return <Spinner animation="border"/>;
  }

  if (!inventory) {
    return <Container>해당 재료 정보를 찾을 수 없습니다.</Container>;
  }

  return (
    <Container className="inventory-detail-container">
      <ToastContainer />
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
                onChange={(e) => {
                  setSelectedBigCategory(e.target.value);
                  setIngredientBigCategory(e.target.value);
                }}
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
      <hr/>
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

      <h5 className="ingredient-detail-sub-title">개수</h5>
      {/* 수량 조절 (정수 + 소수 부분을 가로로 배치) */}
      <Row className="quantity-row align-items-center">
        {/* 정수 부분 */}
        <Col xs={6} className="d-flex align-items-center">
          <Button variant="outline-danger" onClick={() => setIntegerPart(prev => Math.max(prev - 1, 0))}>－</Button>
          <Form.Control
            type="number"
            value={integerPart === "" ? "" : integerPart} // 빈 값 유지
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
      <h5 className="ingredient-detail-sub-title">소비 기한</h5>
      <Row className="date-group">
        <Col xs={6} className="date-item">
          <Form.Label className="date-label">인입일</Form.Label>
          <Form.Control
            type="date"
            defaultValue={inventory.inputDate}
            className="date-input"
            onChange={(e) => setInputDate(e.target.value)}
          />
        </Col>
        <Col xs={6} className="date-item">
          <Form.Label className="date-label">소비기한</Form.Label>
          <Form.Control
            type="date"
            defaultValue={inventory.inventoryExpDate}
            className="date-input"
            onChange={(e) => setInventoryExpDate(e.target.value)}
          />
        </Col>
      </Row>

      {/* 메모 입력 */}
      <h5 className="ingredient-detail-sub-title">메모</h5>
      <Form.Control
        as="textarea"
        defaultValue={inventory.memo}
        placeholder="탭해서 메모 남기기"
        className="memo-input"
        onChange={(e) => setMemo(e.target.value)}
      />

      {/* 수정 삭제 버튼 */}
      <Row className="mt-3">
        <Col>
          <Button variant="warning" className="add-button" onClick={handleUpdateInventory}>
            수정
          </Button>
        </Col>
        <Col>
          <Button variant="danger" className="add-button" onClick={handleDeleteInventory}>
            삭제
          </Button>
        </Col>
      </Row>
      {/* 삭제 확인 모달 */}
      <Modal show={isDeleteModalOpen}
             onHide={() => setIsDeleteModalOpen(false)}
             centered
             className="inventory-delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>정말 "<strong>{inventory.nickName}</strong>"을(를) 삭제하시겠습니까?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>취소</Button>
          <Button variant="danger" onClick={confirmDelete}>삭제</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
    ;
};

export default InventoryDetail;