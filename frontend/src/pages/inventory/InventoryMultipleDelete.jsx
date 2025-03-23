import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Badge, Button, Col, Container, Modal, Placeholder, Row} from 'react-bootstrap';
import IngredientBigCategoryFilter from "components/filter/IngredientBigCategoryFilter";
import axiosInstance from "api/axios";
import {useNavigate} from "react-router-dom";
import "styles/inventory/inventoryList.css";
import {INGREDIENT_IMAGE_PATH} from "config/pathConfig";
import {toast, ToastContainer} from "react-toastify";
import routeConfig from "routes/routeConfig";

const InventoryMultipleDelete = () => {
  const [selectedCategories, setSelectedCategories] = useState(["전체"]);
  const [rawItems, setRawItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [removingItems, setRemovingItems] = useState(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 확인 모달 상태 추가
  const navigate = useNavigate();
  const rowRefs = useRef({}); // row 참조 저장용

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
            ingredientStandardImage: item.ingredientStandardImage
          }));
          setRawItems(extractedItems);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // 필터링된 아이템 리스트
  const filteredItems = useMemo(() => {
    if (!selectedCategories.length || selectedCategories.includes("전체")) return rawItems;
    return rawItems.filter(item => selectedCategories.includes(item.ingredientBigCategory));
  }, [rawItems, selectedCategories]);

  // filteredItem 기준 groupedItems 생성
  const groupedItems = useMemo(() => {
    return (filteredItems || []).reduce((acc, item) => {
      if (!acc[item.ingredientBigCategory]) {
        acc[item.ingredientBigCategory] = [];
      }
      acc[item.ingredientBigCategory].push(item);
      return acc;
    }, {});
  }, [filteredItems]);

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

  // 삭제 핸들러 (애니메이션 후 삭제)
  const handleDeleteInventory = () => {
    if (selectedItems.size === 0) {
      alert("삭제할 재료를 선택해주세요.");
      return;
    }
    setIsDeleteModalOpen(true); // 삭제 확인 모달 열기
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(false); // 삭제 모달 닫기
    setRemovingItems(new Set(selectedItems));

    // 0.5초 후 실제 삭제 실행
    setTimeout(() => {
      const deletePromises = Array.from(selectedItems).map((id) =>
        axiosInstance.delete(`/inventory/${id}`)
      );

      Promise.all(deletePromises)
        .then(() => {
          const deletedCount = selectedItems.size; // 삭제 개수를 먼저 저장
          const message = `선택한 ${deletedCount}개 재료 삭제 완료!.`; // 삭제 개수를 사용하여 메시지 생성

          setSelectedItems(new Set());
          setRemovingItems(new Set());
          setRawItems((prev) => prev.filter(item => !selectedItems.has(item.id)));

          setTimeout(() => {
            toast.success(message);
          }, 300);

          navigate(routeConfig.paths.inventoryList); // `navigate` 먼저 실행 가능
        })
        .catch((error) => {
          toast.error("삭제 중 오류 발생!!");
        });
    }, 500); // 애니메이션이 끝날 때까지 기다림
  };

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
            <h5 className="text-start mb-4">| {category} |</h5>
            <Row
              className="item-container inventory-list-item-row"
              ref={(el) => {
                if (el) rowRefs.current[category] = el;
              }}
            >
              {groupedItems[category].map((item) => {
                const isSelected = selectedItems.has(item.id);
                return (
                  <Col xs={4} key={item.id} className="mb-3">
                    <div
                      className={`item-box ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedItems(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(item.id)) {
                            newSet.delete(item.id);
                          } else {
                            newSet.add(item.id);
                          }
                          return newSet;
                        });
                      }}
                      style={{
                        cursor: "pointer",
                        border: isSelected ? "3px solid green" : "1px solid #ddd",
                        boxShadow: isSelected ? "0px 0px 10px rgba(0, 128, 0, 0.5)" : "none",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <Badge pill className={`badge-position ${item.remainingDays < 0 ? 'bg-danger' : 'bg-success'}`}>
                        {item.remainingDays > 0 ? "D-" + item.remainingDays : item.remainingDays === 0 ? "Today" : "D+" + -item.remainingDays }                      </Badge>
                      <div className="item-content">
                        <img src={`${INGREDIENT_IMAGE_PATH}/${item.ingredientStandardImage}`} alt="item"
                             className="inventory-list-item-image"/>
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

      {/* 삭제 확인 모달 */}
      <Modal show={isDeleteModalOpen} onHide={() => setIsDeleteModalOpen(false)} centered className="inventory-delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>정말 선택한 <strong>{selectedItems.size}개</strong>의 재료를 삭제하시겠습니까?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 삭제 버튼 (화면 중앙 고정) */}
      <Button
        variant="danger"
        className="delete-multiple-inventory-button position-fixed"
        onClick={handleDeleteInventory}
      >
        선택한 재료 삭제
      </Button>
    </Container>
  );
};

export default InventoryMultipleDelete;