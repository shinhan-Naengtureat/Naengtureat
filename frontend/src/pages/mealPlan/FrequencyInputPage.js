import BackButton from "components/BackButton";
import { ICON_IMAGE_PATH } from "config/pathConfig";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/routeConfig";
import styled from "styled-components";

const meals = [
    { id: "아침",icon:`${ICON_IMAGE_PATH}/breakfast.png` },
    { id: "점심",icon:`${ICON_IMAGE_PATH}/lunch.png` },
    { id: "저녁",icon:`${ICON_IMAGE_PATH}/dinner.png` },

]

const FrequencyInputPage = () => {
    const navigate = useNavigate();
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const toggleMeal = (meal) => {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };

  const toggleDay = (day) => {
    if (day === "전체") {
      setSelectedDays((prev) =>
        prev.includes("전체") ? [] : ["전체", "월", "화", "수", "목", "금", "토", "일"]
      );
    } else {
        setSelectedDays((prev) =>{
        const filteredDays = prev.filter((d) => d !== "전체");
            return prev.includes(day) ? filteredDays.filter((d) => d !== day) : [...filteredDays, day];
        });
    }
  };
 

 
 const totalMeals = selectedMeals.length * (selectedDays.includes("전체") ? 7 : selectedDays.length);
// 뒤로가기기
  const handleBefore = () => {
    navigate(RouteConfig.paths.mealPlanListDaily);
  };

    return (
      
      <ContainerFre>
         <div className="preferred-header">
        <BackButton onClick={handleBefore} />
      </div>
          <div>
              
          <Header>
          <Title1>이번주</Title1>
              <Title2>몇개의 식단을 만들어드릴까요?</Title2>
          <CountSection>
              <CountText>
          총 <CountNumber>{totalMeals}</CountNumber><CountUnit>회</CountUnit>
              </CountText>
              <CountLine />
              <SubText>를 선택하셨어요</SubText>
              </CountSection>
              </Header>

      {/* 끼니 선택 */}
      <MealContainer>
        {meals.map((meal) => (
            <MealButton
            key={meal.id}
            selected={selectedMeals.includes(meal.id)}
            onClick={() => toggleMeal(meal.id)}
            >
            <MealIcon src={meal.icon} alt={meal.id} />
                {meal.id}
            </MealButton>
            
        ))}
      </MealContainer>

          {/* 요일 선택 (3x3 그리드 형태) */}
                <Line />
      <DayContainer>
        {["전체", "월", "화", "수", "목", "금", "토", "일"].map((day) => (
          <DayButton key={day} selected={selectedDays.includes(day)} onClick={() => toggleDay(day)}>
            {day}
          </DayButton>
        ))}
      </DayContainer>

</div>
      {/* 다음 버튼 */}
       <NextButton onClick={() => console.log(`총 ${totalMeals} 회`)}>다음</NextButton>
    </ContainerFre>
    
  );
};
// Styled Components
const ContainerFre = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;
const Header = styled.div`
  width: 100%;
  text-align: left;
`;
const Title1 = styled.h2`
  font-size: 22px;
  font-weight: bold;
  text-align: left;
  color: #6B7682;
  margin-bottom: 5px;
`;
const Title2 = styled.h2`
  font-size: 22px;
  font-weight: bold;
  text-align: left;
  color: #343D4C;
  margin-bottom: 10px;
`;

const CountSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  margin-bottom: 20px;
  width: 100%;
`;

const CountText = styled.div`
  font-size: 18px;
   font-weight: bold;
  color: #6B7682; 
  display: flex;
  align-items: center;

`;

const CountNumber = styled.span`
  font-size: 22px;
  font-weight: bold;
  color: #f35c04; /* 강조된 숫자 */
  margin: 0 4px;
`;

const CountUnit = styled.span`
  font-size: 18px;
   font-weight: bold;
  color: #6B7682;
`;

const CountLine = styled.div`
  width: 100%;
  border-bottom: 2px solid #343D4C;
  margin: 5px 0 10px;
`;
const Line = styled.div`
  width: 100%;
  border-bottom: 2px solid #F2F3F7;
  margin: 5px 0 10px;
  margin-bottom: 20px;
`;

const SubText = styled.p`
  font-size: 14px;
  color: #a0aec0; /* gray-500 */
`;

const MealContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-bottom: 20px;
`;

const MealButton = styled.button`
  background-color: ${({ selected }) => (selected ? "#54428E" : "#f2f2f2")};
  color: ${({ selected }) => (selected ? "white" : "#8B94A0")};
  font-size: 15px;
  font-weight: bold;
  padding: 15px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  width: 85px;
  height: 100px;
  text-align: center;
  

  display: flex;
  flex-direction: column; /* 이미지 위, 텍스트 아래 */
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const MealIcon = styled.img`
  width: 60px;
  height: 60px;
`;
const DayContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

const DayButton = styled.button`
  background-color: ${({ selected }) => (selected ? "#54428E" : "#f2f2f2")};
  color: ${({ selected }) => (selected ? "white" : "#8B94A0")};
  font-size: 17px;
  font-weight: 600;
  padding: 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  width: 60px;
  height: 60px;
  text-align: center;
`;



const NextButton = styled.button`
  width: 80%;
  max-width: 400px;
  background-color: #f35c04;
  color: white;
  padding: 14px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
`;

export default FrequencyInputPage;
