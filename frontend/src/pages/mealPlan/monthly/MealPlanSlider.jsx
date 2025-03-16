import Slider from "react-slick";
import DailyMealPlanCard from "pages/mealPlan/monthly/DailyMealPlanCard";
import MealPlanSummary from "pages/mealPlan/monthly/MealPlanSummary";
import { format } from "date-fns";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

function MealPlanSlider({ mealData, calendarValue, sliderRef }) {
  // 선택한 날짜의 이벤트 필터링
  const selectedDate = format(calendarValue, "yyyy-MM-dd");
  const selectedEvents = mealData.filter((m) => m.date === selectedDate);

  // 아침, 점심, 저녁 순서로 정렬
  const sortedEvents = selectedEvents.sort((a, b) => {
    const mealOrder = { 아침: 1, 점심: 2, 저녁: 3 };
    return mealOrder[a.type] - mealOrder[b.type];
  });

  const sliderSettings = {
    dots: true,
    infinite: false, // 무한 루프 방지
    speed: 500,
    slidesToShow: 1, // 한 번에 1개 보이도록 설정
    slidesToScroll: 1, // 한 번에 1개씩 이동
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 2 } }, { breakpoint: 480, settings: { slidesToShow: 1 } }],
  };

  return (
    <Slider ref={sliderRef} {...sliderSettings}>
      <div className="event-list">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event, index) => 
          <DailyMealPlanCard key={index} name={event.recipeName} type={event.type} check={event.check} />)
        ) : (
          <p className="mealplan-no">선택한 날짜에 식단이 없습니다.</p>
        )}
      </div>
      <MealPlanSummary mealData={mealData} calendarValue={calendarValue} />
    </Slider>
  );
}

export default MealPlanSlider;
