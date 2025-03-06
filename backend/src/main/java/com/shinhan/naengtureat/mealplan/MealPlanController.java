package com.shinhan.naengtureat.mealplan;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
		try {
			List<String> category = mealPlanService.getCategoryAll();
			if (category == null || category.isEmpty()) {
				return ResponseEntity.noContent().build();
			}
			return ResponseEntity.ok(category);

		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "카테고리 조회 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

}
