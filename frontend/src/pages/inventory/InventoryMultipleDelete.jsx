import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import IngredientBigCategoryFilter from "components/filter/IngredientBigCategoryFilter";
import axiosInstance from "api/axios";
import { useNavigate } from "react-router-dom";
import "styles/inventory/inventoryList.css";
import { INGREDIENT_IMAGE_PATH } from "config/pathConfig";

const InventoryMultipleDelete = () => {
  const [selectedCategories, setSelectedCategories] = useState(["전체"]);
  const [rawItems, setRawItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set()); // 선택된 아이템 ID 저장
  const [removingItems, setRemovingItems] = useState(new Set()); // 삭제 애니메이션 상태 추가
  const navigate = useNavigate();

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

    return () => { ignore = true; };
  }, []);

  // 필터링된 아이템 리스트
  const filteredItems = useMemo(() => {
    if (!selectedCategories.length || selectedCategories.includes("전체")) return rawItems;
    return rawItems.filter(item => selectedCategories.includes(item.ingredientBigCategory));
  }, [rawItems, selectedCategories]);

  const groupedItems = useMemo(() => {
    return (filteredItems || []).reduce((acc, item) => {
      if (!acc[item.ingredientBigCategory]) {
        acc[item.ingredientBigCategory] = [];
      }
      acc[item.ingredientBigCategory].push(item);
      return acc;
    }, {});
  }, [filteredItems]);

  const categories = useMemo(() => {
    if (!rawItems.length) return ["전체"];
    const uniqueCategories = [...new Set(rawItems.map(item => item.ingredientBigCategory))];
    return ["전체", ...uniqueCategories];
  }, [rawItems]);

  // 선택/해제 토글
  const toggleSelection = (id) => {
    setSelectedItems((prevSelected) => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  // ✅ 삭제 핸들러 (애니메이션 후 삭제)
  const handleDeleteInventory = () => {
    if (selectedItems.size === 0) {
      alert("삭제할 재료가 없습니다.");
      return;
    }

    if (window.confirm("정말 삭제하시겠습니까?")) {
      setRemovingItems(new Set(selectedItems)); // 삭제 애니메이션 적용

      // 0.5초 후 실제 삭제 실행
      setTimeout(() => {
        const deletePromises = Array.from(selectedItems).map((id) =>
          axiosInstance.delete(`/inventory/${id}`)
        );

        Promise.all(deletePromises)
          .then(() => {
            alert("선택한 재료가 삭제되었습니다.");
            setSelectedItems(new Set());
            setRemovingItems(new Set());
            setRawItems((prev) => prev.filter(item => !selectedItems.has(item.id)));
          })
          .catch((error) => {
            console.error("재료 삭제 중 오류 발생:", error);
            alert("삭제 중 오류가 발생했습니다.");
          });
      }, 500); // 애니메이션이 끝날 때까지 기다림
    }
  };

  return (
    <Container className="inventory-container">
      <IngredientBigCategoryFilter
        items={["전체", ...new Set(rawItems.map(item => item.ingredientBigCategory))]}
        selectedItems={selectedCategories}
        toggleItem={(category) => {
          setSelectedCategories((prev) =>
            category === "전체" ? ["전체"] : prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
          );
        }}
      />

      {loading ? (
        <Row className="item-container"><p>로딩 중...</p></Row>
      ) : (
        Object.keys(
          rawItems.reduce((acc, item) => {
            acc[item.ingredientBigCategory] = acc[item.ingredientBigCategory] || [];
            acc[item.ingredientBigCategory].push(item);
            return acc;
          }, {})
        ).map((category) => (
          <div key={category}>
            <h5 className="text-start mb-4">| {category} |</h5>
            <Row className="item-container">
              {rawItems.filter(item => item.ingredientBigCategory === category).map((item) => {
                const isSelected = selectedItems.has(item.id);
                const isRemoving = removingItems.has(item.id);
                return (
                  <Col xs={4} key={item.id} className="mb-3">
                    <div
                      className={`item-box ${isSelected ? "selected" : ""} ${isRemoving ? "removing" : ""}`}
                      onClick={() => toggleSelection(item.id)}
                      style={{
                        cursor: "pointer",
                        border: isSelected ? "3px solid green" : "1px solid #ddd",
                        boxShadow: isSelected ? "0px 0px 10px rgba(0, 128, 0, 0.5)" : "none",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <Badge pill className={`badge-position ${item.remainingDays < 0 ? 'bg-danger' : 'bg-success'}`}>
                        {item.remainingDays}
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

      {/* 🛑 삭제 버튼 (화면 중앙 고정) */}
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