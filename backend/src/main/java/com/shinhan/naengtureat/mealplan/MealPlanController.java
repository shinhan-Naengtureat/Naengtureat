package com.shinhan.naengtureat.mealplan;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.mealplan.model.MealPlanService;
import com.shinhan.naengtureat.member.model.MemberService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/mealplan")
public class MealPlanController {

	@Autowired
	MealPlanService mealPlanService;

	@Autowired
	MemberService memberService;

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

	// 예산 업데이트
	@PutMapping("/budget")
	public ResponseEntity<Object> updateBudget(@RequestBody Map<String, Integer> requestBody) {
		Long memberId = 2L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)
		Integer budget = requestBody.get("budget");
		if (budget == null || budget < 0) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효한 예산 값을 입력하세요.");
		}
		int updatedRows = memberService.updateMemberBudgetById(memberId, budget);

		if (updatedRows == 0) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("예산 업데이트를 실패했습니다.");
		}
		return ResponseEntity.ok(updatedRows);
	}

}
