import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Badge, Button, Col, Container, Form, Placeholder, Row} from 'react-bootstrap';
import IngredientBigCategoryFilter from "components/filter/IngredientBigCategoryFilter";
import axiosInstance from "api/axios";
import {useLocation, useNavigate} from "react-router-dom";
import "styles/inventory/inventoryList.css";
import {INGREDIENT_IMAGE_PATH} from "config/pathConfig";
import {toast, ToastContainer} from "react-toastify";

const InventoryList = () => {
  // 다중 선택을 위한 상태 추가
  const [selectedCategories, setSelectedCategories] = useState(["전체"]);
  const [rawItems, setRawItems] = useState();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState(null);
  const rowRefs = useRef({}); // row 참조 저장용

  //아이템 useEffect
  useEffect(() => {
    let ignore = false;

    axiosInstance.get(`/inventory`)
      .then(response => {
        if (!ignore) {
          const extractedItems = response.data.map(item => ({
            id: item.id,
            nickName: item.nickName,
            remainingDays: item.remainingDays,
            ingredientBigCategory: item.ingredientBigCategory,
            ingredientStandardImage: item.ingredientStandardImage,
            memo: item.memo,
            ingredientSmallCategory: item.ingredientSmallCategory
          }));
          setRawItems(extractedItems);
          setLoading(false); // 데이터 로딩 완료
        }
      })
      .catch(error => {
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  //필터링된 아이템 리스트
  const filteredItems = useMemo(() => {
    if (!selectedCategories.length || selectedCategories.includes("전체")) return rawItems;
    return rawItems.filter(item => selectedCategories.includes(item.ingredientBigCategory));
  }, [rawItems, selectedCategories]);

  // 검색어 필터링 추가
  const searchedItems = useMemo(() => {
    if (!searchTerm) return filteredItems;
    return filteredItems.filter(item => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        item.nickName.toLowerCase().includes(lowerSearchTerm) ||
        item.ingredientBigCategory.toLowerCase().includes(lowerSearchTerm) ||
        item.memo?.toLowerCase().includes(lowerSearchTerm) || // memo가 존재하는 경우만 검사
        item.ingredientSmallCategory.toLowerCase().includes(lowerSearchTerm)
      );
    });
  }, [filteredItems, searchTerm]);

  const groupedItems = useMemo(() => {
    return (searchedItems || []).reduce((acc, item) => {
      if (!acc[item.ingredientBigCategory]) {
        acc[item.ingredientBigCategory] = [];
      }
      acc[item.ingredientBigCategory].push(item);
      return acc;
    }, {});
  }, [searchedItems]);

  //카테고리 목록 동적 생성
  const categories = useMemo(() => {
    if (!rawItems || rawItems.length === 0) return ["전체"];
    const uniqueCategories = [...new Set(rawItems.map(item => item.ingredientBigCategory))];
    return ["전체", ...uniqueCategories];
  }, [rawItems]);

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

  //토스트 표시
  useEffect(() => {
    if (location.state?.message && !toastMessage) {
      setToastMessage(location.state.message); // 메시지를 상태로 저장
      toast.success(location.state.message); // 토스트 실행

      setTimeout(() => {
        navigate(location.pathname, { replace: true });
      }, 1000); // navigate를 1초 후 실행
    }
  }, [location, navigate, toastMessage]);


// 로딩 끝났을 때 애니메이션 실행
  useEffect(() => {
    if (!loading && rowRefs.current) {
      Object.keys(rowRefs.current).forEach((key, index) => {
        const ref = rowRefs.current[key];
        if (ref) {
          setTimeout(() => {
            ref.classList.add("visible");
          }, index * 200);
        }
      });
    }
  }, [loading, groupedItems]);

  useEffect(() => {
    // 필터가 바뀔 때마다 refs를 초기화
    rowRefs.current = [];
  }, [groupedItems]);

  return (
    <Container className="inventory-container">
      <ToastContainer />
      <IngredientBigCategoryFilter
        items={categories}
        selectedItems={selectedCategories}
        toggleItem={toggleCategory}
      />

      <Form.Control
        type="text"
        placeholder="찾고싶은 재료를 검색해주세요"
        className="my-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
        Object.keys(groupedItems).map((category, idx) => (
          <div key={category}>
            <h5 className="text-start mb-4">| {category} |</h5> {/* 마진 추가 */}
            <Row
              className="item-container inventory-list-item-row"
              ref={(el) => {
                if (el) rowRefs.current[category] = el;
              }}
            >
              {groupedItems[category].map((item) => {
                const isExpired = item.remainingDays < 0;
                return (
                  <Col xs={4} key={item.id} className="mb-3"> {/* xs=4: 한 줄에 3개 */}
                    <div className={`item-box ${isExpired ? 'expired' : 'fresh'}`}
                         onClick={() => navigate(`/inventory/${item.id}`)} // 클릭 시 이동
                         style={{ cursor: "pointer" }} // 마우스 오버 시 포인터 변경
                    >
                      <Badge pill className={`badge-position ${isExpired ? 'bg-danger' : 'bg-success'}`}>
                        {item.remainingDays > 0 ? "D-" + item.remainingDays : item.remainingDays === 0 ? "Today" : "D+" + -item.remainingDays }
                      </Badge>
                      <div className="item-content">
                        <img src={`${INGREDIENT_IMAGE_PATH}/${item.ingredientStandardImage}`} alt="item" className="inventory-list-item-image" />
                        <div className="item-name">{item.nickName}</div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        ))
      )}

      <Button
        variant="warning"
        className="rounded-circle position-fixed"
        style={{bottom: "150px", right: "30px", width: "70px", height: "70px"}}
        onClick={() => navigate("/inventory/new")}  // 새로운 등록 페이지로 이동
      >
        +
      </Button>
    </Container>
  );
};

export default InventoryList;