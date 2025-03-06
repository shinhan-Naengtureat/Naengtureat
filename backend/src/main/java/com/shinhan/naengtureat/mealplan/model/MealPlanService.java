package com.shinhan.naengtureat.mealplan.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.recipe.model.RecipeHashtagRepository;
import com.shinhan.naengtureat.recipe.model.RecipeRepository;

@Service
public class MealPlanService {

	@Autowired
	RecipeRepository recipeRepo;
	
	@Autowired
	RecipeHashtagRepository recipeHashRepo;

	public List<String> getCategoryAll() {
		return recipeRepo.findCategoryAll();
	}

	public List<String> getThemeAll() {
		return recipeHashRepo.findThemeAll();
	}
	
}
