import { ko } from "date-fns/locale/ko";
import { addDays, format } from "date-fns";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/routeConfig";

function WeeklyMealPlanTable({ memoizedMeals, weekStart, handleDragEnd, onDeleteMeal, toggleMealCheck, deleteMeal }) {
  const navigate = useNavigate();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
        <table className="meal-plan-table">
          <thead>
            <tr>
              <td style={{ width: "15%" }}></td>
              <td style={{ width: "28%" }}>아침</td>
              <td style={{ width: "28%" }}>점심</td>
              <td style={{ width: "28%" }}>저녁</td>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }).map((_, i) => {
              const day = addDays(weekStart, i);
              const key = format(day, "yyyy-MM-dd");
              const isToday =
                format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
              const mealsForDay = memoizedMeals.filter(
                (meal) => meal.date === key
              );

              return (
                <tr key={i}>
                  <td className="date-cell">
                    <div
                      className={`today-wrapper ${
                        isToday ? "highlight-circle" : ""
                      }`}
                    >
                      <div className="day-label">
                        {format(day, "d", { locale: ko })}
                      </div>
                      <div className="week-label">
                        {format(day, "E", { locale: ko })}
                      </div>
                    </div>
                  </td>

                  {["아침", "점심", "저녁"].map((mealType) => {
                    const meals = mealsForDay.filter(
                      (m) => m.type === mealType
                    );
                    const isPast =
                      new Date(key) < new Date().setHours(0, 0, 0, 0);
                    const isFuture =
                      new Date(key).setHours(0, 0, 0, 0) >
                      new Date().setHours(0, 0, 0, 0);

                    return (
                      <Droppable
                        droppableId={`${key}-${mealType}`}
                        key={`${key}-${mealType}`}
                        isDropDisabled={isPast}
                      >
                        {(provided) => (
                          <td
                            className="meal-droppable"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <div className="meal-info">
                              {meals.map((meal, idx) => (
                                <Draggable
                                  draggableId={meal.id.toString()}
                                  index={idx}
                                  key={meal.id}
                                  isDragDisabled={isPast}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`meal-item ${
                                        meal.check ? "completed" : "pending"
                                      } ${isFuture ? "future" : ""}`}
                                    >
                                      <OverlayTrigger
                                        trigger="click"
                                        placement="bottom"
                                        overlay={
                                          <Popover
                                            id={`popover-${key}-${mealType}`}
                                          >
                                            <Popover.Body>
                                              <p>
                                                <span
                                                  className={`meal-status ${
                                                    meal.check
                                                      ? "checked"
                                                      : meal.date !==
                                                        format(
                                                          new Date(),
                                                          "yyyy-MM-dd"
                                                        )
                                                      ? "disabled"
                                                      : ""
                                                  }`}
                                                  onClick={() => {
                                                    if (
                                                      !meal.check &&
                                                      meal.date ===
                                                        format(
                                                          new Date(),
                                                          "yyyy-MM-dd"
                                                        )
                                                    ) {
                                                      toggleMealCheck(meal);
                                                    }
                                                  }}
                                                >
                                                  {"이행 여부 체크"}
                                                </span>
                                              </p>
                                              <hr />
                                              <p
                                                className="meal-show-recipe"
                                                onClick={() => navigate(RouteConfig.paths.recipeDetail.replace(":recipeId", meal.recipeId))}>
                                                  레시피 보기
                                              </p>
                                              <hr />
                                              <p
                                                onClick={() =>
                                                  deleteMeal(meal.date) &&
                                                  onDeleteMeal(meal.id)
                                                } // 조건에 따라 삭제
                                                className={`delete-meal ${
                                                  deleteMeal(meal.date)
                                                    ? ""
                                                    : "disabled-delete"
                                                }`} // 삭제 가능 여부에 따라 클래스 변경
                                              >
                                                식단 삭제
                                              </p>
                                            </Popover.Body>
                                          </Popover>
                                        }
                                        rootClose
                                      >
                                        <div className="meal-item-text">
                                          {meal.recipeName}
                                        </div>
                                      </OverlayTrigger>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                            {provided.placeholder}
                          </td>
                        )}
                      </Droppable>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </DragDropContext>
  );
}

export default WeeklyMealPlanTable;