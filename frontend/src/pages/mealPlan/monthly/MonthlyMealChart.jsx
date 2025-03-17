import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

// Chart.js에 필요한 요소 등록
ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

function MonthlyMealChart({ estimatedExpense, usedAmount }) {
  const chartData = {
    labels: ["비용 비교"], // 단일 카테고리
    datasets: [
      {
        label: "예상 외식 비용",
        data: [estimatedExpense],
        backgroundColor: "rgba(136, 132, 216, 0.7)", // 파란색
        borderColor: "rgba(136, 132, 216, 1)",
        borderWidth: 1,
      },
      {
        label: "사용한 금액",
        data: [usedAmount],
        backgroundColor: "rgba(243, 92, 4, 0.7)", // 주황색
        borderColor: "rgba(243, 92, 4, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: "120px" }}> {/* 차트 크기 줄이기 */}
      <Bar
        data={chartData}
        options={{
          responsive: true,
          aspectRatio: 3, // 차트 높이를 줄여 공간 확보
          plugins: {
            legend: {
              display: true,
              position: "right", // 범례를 오른쪽에 유지
              labels: { font: { size: 10 } }, // 범례 글자 크기 조절
            },
          },
          scales: {
            x: {
              display: false,
              categoryPercentage: 0.4,
              barPercentage: 0.5,
            },
            y: { display: false },
          },
          barThickness: 15, // 막대 두께 줄이기
        }}
      />
    </div>
  );
}

export default MonthlyMealChart;
