package com.shinhan.naengtureat.mealplan;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.mealplan.dto.MealPlanDTO;
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

	// 식단 월간 조회
	@GetMapping("/month/{month}")
	public ResponseEntity<Object> getMonthlyMealPlanList(@PathVariable("month") String month) {
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 2L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)

			List<MealPlanDTO> monthlyMealPlanList = mealPlanService.getMonthlyMealPlanList(memberId, month);

			return ResponseEntity.ok(monthlyMealPlanList);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "식단 월간 조회 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	// 식단 주간 조회
	@GetMapping("/week/{day}")
	public ResponseEntity<Object> getWeeklyMealPlanList(@PathVariable("day") String day) {
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 2L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)
			
			List<MealPlanDTO> weeklyMealPlanList = mealPlanService.getWeeklyMealPlanList(memberId, day);
			
			return ResponseEntity.ok(weeklyMealPlanList);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "식단 주간 조회 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	// 저장된 식단 단건 삭제
	@DeleteMapping("/{mealPlanId}")
	public ResponseEntity<Object> deleteMealPlan(@PathVariable("mealPlanId") Long mealPlanId){
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 2L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)

			String result = mealPlanService.deleteMealPlan(memberId, mealPlanId);

			return ResponseEntity.ok(result);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "식단 삭제 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	// 식단 이행여부 체크
	@PutMapping("/{mealPlanId}/check")
	public ResponseEntity<Object> checkMealPlan(@PathVariable("mealPlanId") Long mealPlanId){
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 2L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)
			
			String result = mealPlanService.checkMealPlan(memberId, mealPlanId);
			
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "식단 이행여크 체크 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	// 저장된 식단 이동
	@PutMapping("/{mealPlanId}")
	public ResponseEntity<Object> updateMealPlan(@PathVariable("mealPlanId") Long mealPlanId, @RequestBody MealPlanDTO mealPlanDTO){
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 2L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)

			mealPlanDTO.setId(mealPlanId);
			String result = mealPlanService.updateMealPlan(memberId, mealPlanDTO);

			return ResponseEntity.ok(result);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "저장된 식단 이동 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
}