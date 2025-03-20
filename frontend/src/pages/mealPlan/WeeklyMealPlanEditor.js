import React, { useEffect, useState,useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { startOfWeek, addDays, format, isBefore } from "date-fns";
import { ko } from "date-fns/locale";
import "styles/mealPlan/WeeklyMealPlan.css";
import { Overlay, Popover } from "react-bootstrap";
import "../../index.css"; 
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/routeConfig";

const WeeklyMealPlanEditor = ({ initialMealPlan, extraMeals, updateMealPlan }) => {
    const [mealPlan, setMealPlan] = useState(initialMealPlan);
    const [backupMeals, setBackupMeals] = useState(extraMeals);

    const [selectedMeal, setSelectedMeal] = useState(null); // 선택한 식단 저장
    const [showPopover, setShowPopover] = useState(false); // 팝오버 표시 여부
    const targetRef = useRef(null); // 팝오버 위치 지정
  
    useEffect(() => {
        setMealPlan(initialMealPlan);
    }, [initialMealPlan]);

    //  팝오버 열기
    const handleOpenPopover = (event, meal) => {
        setSelectedMeal(meal);
        targetRef.current = event.target; // 클릭된 요소를 target으로 설정
        setShowPopover(true);
  };
  
    //  식단 삭제
    const handleDeleteMeal = () => {
        if (!selectedMeal) return;
      
        const newMealPlan = mealPlan.filter(
            (m) => !(m.date === selectedMeal.date && m.type === selectedMeal.type)
        );

        setMealPlan(newMealPlan);
        updateMealPlan(newMealPlan);
        setShowPopover(false); // 팝오버 닫기
    };

    // 식단 새로고침 (랜덤 변경)
    const handleRefreshMeal = () => {
        if (!selectedMeal || extraMeals.length === 0) return;

        const newMealPlan = [...mealPlan];
        const mealIndex = newMealPlan.findIndex(
            (m) => m.recipeName === selectedMeal.recipeName //기존 식단과 같은이름 찾기
        );

       if (mealIndex !== -1) {
    //  기존 식단과 겹치지 않는 extraMeals 필터링
    const availableMeals = extraMeals.filter(meal => meal !== selectedMeal.recipeName);

    //  대체할 음식이 없는 경우 기존 음식 유지
    if (availableMeals.length === 0) {
      console.warn("새로운 식단이 없습니다. 기존 식단 유지");
      setShowPopover(false);
      return;
         }
    //  새로운 랜덤 음식 선택
    const randomExtraMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];

    //  새로운 식단으로 업데이트
    newMealPlan[mealIndex] = {
      ...newMealPlan[mealIndex],
       recipeName: randomExtraMeal.recipeName, //  문자열만 저장
      recipeId: randomExtraMeal.recipeId, //  기존 ID도 함께 변경 (필요시)
    };

    setMealPlan(newMealPlan);
    updateMealPlan(newMealPlan);
  }

        setShowPopover(false); // 팝오버 닫기
    };

  //  현재 주간 날짜 계산 (월요일 ~ 일요일)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  //  식단을 요일 및 끼니별로 정리
  const structuredMealPlan = weekDays.map((day) => {
    const formattedDate = format(day, "yyyy-MM-dd");
    return {
      date: formattedDate,
      isDisabled: isBefore(day, today),
       dayLabel: (
      <>
        {format(day, "d", { locale: ko })}
        <br />
        {format(day, "E", { locale: ko })}
      </>
    ),
      meals: {
        아침: mealPlan.find((m) => m.date === formattedDate && m.type === "아침") || null,
        점심: mealPlan.find((m) => m.date === formattedDate && m.type === "점심") || null,
        저녁: mealPlan.find((m) => m.date === formattedDate && m.type === "저녁") || null,
      },
    };
  });

  //  드래그 앤 드롭 기능 (다른 날짜 및 끼니 이동 가능)
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId.split("-");
    const destId = result.destination.droppableId.split("-");
// console.log(" sourceId:", sourceId); // 확인
//   console.log( "destId:", destId); // 확인
      
      if (sourceId.length < 2 || destId.length < 2) {
    console.error(" droppableId 값이 잘못되었습니다.", { sourceId, destId });
    return;
  }
    // sourceId[0]은 YYYY-MM-DD 형식이어야 함
  const sourceDate = `${sourceId[0]}-${sourceId[1]}-${sourceId[2]}`;
  const sourceMealType = sourceId[3]; // "아침", "점심", "저녁"

  const destDate = `${destId[0]}-${destId[1]}-${destId[2]}`;
  const destMealType = destId[3];

  // 오늘 이전 날짜로 이동하려고 하면 중단
  if (isBefore(new Date(destDate), today)) {
      console.warn("이전 날짜로 이동할 수 없습니다.");
      return;
  }

    
  //  상태 업데이트
  const newMealPlan = [...mealPlan];
      
  //  드래그한 식단 찾기
  const sourceMealIndex = newMealPlan.findIndex(
    (m) => m.date === sourceDate && m.type === sourceMealType
  );
 
 // 대상 위치의 식단 찾기
  const destMealIndex = newMealPlan.findIndex(
    (m) => m.date === destDate && m.type === destMealType
      );


if (sourceMealIndex === -1) {
    console.error("원본 식단을 찾을 수 없음.");
    return;
      }
      
      if (destMealIndex !== -1) {
      //  대상 위치에 식단이 있으면 **서로 위치 교환**
    const temp = { ...newMealPlan[sourceMealIndex] };
    newMealPlan[sourceMealIndex] = {
      ...newMealPlan[destMealIndex],
      date: sourceDate,
      type: sourceMealType,
      };
      
    newMealPlan[destMealIndex] = {
      ...temp,
      date: destDate,
      type: destMealType,
      };
      
  } else {
    // 대상 위치가 비어 있으면 이동만 수행
    newMealPlan[sourceMealIndex] = {
      ...newMealPlan[sourceMealIndex],
      date: destDate,
      type: destMealType,
    };
  }
    setMealPlan(newMealPlan);
    updateMealPlan(newMealPlan);

  };

 
  return (
    
    <DragDropContext onDragEnd={handleDragEnd}>
      <table className="meal-plan-table" style={{margin:"auto" }}>
        <thead>
          <tr>
            <th> </th>
            <th>아침</th>
            <th>점심</th>
            <th>저녁</th>
          </tr>
        </thead>
        <tbody>
          {structuredMealPlan.map(({ date, dayLabel, meals,isDisabled }) => (
            <tr key={date}>
              <td className="date-cell">{dayLabel}</td>
              {["아침", "점심", "저녁"].map((mealType) => 
                isDisabled ? (
                  <td
                  key={`${date}-${mealType}`}
                                        className="meal-cell disabled"
                                        style={{
                                            width: "120px",
                                            wordWrap: "break-word",
                                            whiteSpace: "normal",
                                            backgroundColor: "#dee2e6", // 비활성화 스타일
                                            cursor: "not-allowed",
                                        }}
                                    >
                    {meals[mealType] ? meals[mealType].recipeName : "x"}
                    </td>
                    ):(
                <Droppable key={`${date}-${mealType}`} droppableId={`${date}-${mealType}`}>
                  {(provided) => (
                        <td
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="meal-cell"
                          style={{
                            "width": "120px", "word-wrap": "break-word", "white-space": "normal"                          
                          }}
                        >
                      {meals[mealType] ? (
                       <Draggable key={meals[mealType].id} draggableId={meals[mealType].id} index={0}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                                  className="meal-item"
                                  onClick={(event) => handleOpenPopover(event, meals[mealType])}
                                   title="삭제 또는 새로고침 하려면 클릭"
                            >
                              {meals[mealType].recipeName}
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <div className="empty-meal-slot"></div>
                      )}
                      {provided.placeholder}
                    </td>
                  )}
                </Droppable>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
        {/*  팝오버 */}
            <Overlay show={showPopover} target={targetRef.current} placement="right">
                <Popover id="meal-popover">
                    <Popover.Header as="h3">식단 관리</Popover.Header>
                    <Popover.Body>
                        <p>{selectedMeal?.recipeName}</p>
                        <button className="delete-btn" onClick={handleDeleteMeal}>
                            삭제
                        </button>
                        <button className="refresh-btn" onClick={handleRefreshMeal}>
                            새로고침
                        </button>
                        <button className="close-btn" onClick={() => setShowPopover(false)}>
                            닫기
                        </button>
                    </Popover.Body>
                </Popover>
            </Overlay>
    </DragDropContext>
  );
};

export default WeeklyMealPlanEditor;

