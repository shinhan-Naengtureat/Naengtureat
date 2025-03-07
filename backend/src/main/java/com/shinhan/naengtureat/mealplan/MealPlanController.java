package com.shinhan.naengtureat.mealplan;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.mealplan.dto.MealPlanDTO;
import com.shinhan.naengtureat.mealplan.model.MealPlanService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/mealplan")
public class MealPlanController {

	@Autowired
	MealPlanService mealPlanService;

	// 카테고리 조회
	@GetMapping("/category")
	public ResponseEntity<Object> getCategory() {
		List<String> category = mealPlanService.getCategoryAll();
		if (category == null || category.isEmpty()) {
			throw new NoSuchElementException("해당 카테고리를 찾을 수 없습니다.");
		}
		return ResponseEntity.ok(category);
	}

	// 테마조회
	@GetMapping("/theme")
	public ResponseEntity<Object> getTheme() {
		List<String> theme = mealPlanService.getThemeAll();
		if (theme == null || theme.isEmpty()) {
			throw new NoSuchElementException("해당 테마를 찾을 수 없습니다.");
		}
		return ResponseEntity.ok(theme);
	}

	// 식단 일간 조회
	@GetMapping("/daily/{day}")
	public ResponseEntity<Object> getDailyMealPlanList(@PathVariable("day") String day) {
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 2L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)

			List<MealPlanDTO> dailyMealPlanList = mealPlanService.getDailyMealPlanList(memberId, day);

			return ResponseEntity.ok(dailyMealPlanList);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "식단 일간 조회 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
}
