package com.shinhan.naengtureat.mealplan;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
}
