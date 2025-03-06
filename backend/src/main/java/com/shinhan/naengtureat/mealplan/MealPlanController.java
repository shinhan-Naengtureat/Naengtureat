package com.shinhan.naengtureat.mealplan;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	public List<String> getCategory() {
		return mealPlanService.getCategoryAll();
	}

}
