import Calendar from "react-calendar";
import { format, getDaysInMonth } from "date-fns";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { getTileClassName } from "utils/mealPlanUtils";
import "react-calendar/dist/Calendar.css";

function CalendarView({ mealData, calendarValue, setCalendarValue, sliderRef }) {
  
  // 날짜 변경 시 첫 번째 슬라이드로 이동
  const handleDateChange = (date) => {
    setCalendarValue(date);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0); // 첫 번째 슬라이드로 이동
    }
  };

  // 선택된 날짜 기준으로 전달/다음 달 이동
  const handleMonthChange = ({ activeStartDate }) => {
    setCalendarValue((prevDate) => {
      if (!activeStartDate) return prevDate;
      const day = prevDate.getDate();
      const daysInNewMonth = getDaysInMonth(activeStartDate);
      return new Date(activeStartDate.getFullYear(), activeStartDate.getMonth(), Math.min(day, daysInNewMonth));
    });
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        tileClassName={({ date }) => getTileClassName(date, mealData)}
        onChange={handleDateChange}
        value={calendarValue}
        formatDay={(local, date) => format(date, "d")}
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        onActiveStartDateChange={handleMonthChange}
        nextLabel={<IoIosArrowForward style={{ fontSize: "24px" }} />}
        prevLabel={<IoIosArrowBack style={{ fontSize: "24px" }} />}
        calendarType="gregory"
        locale="ko"
      />
    </div>
  );
}

export default CalendarView;
