package com.shinhan.naengtureat.mealplan.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.recipe.model.RecipeRepository;

@Service
public class MealPlanService {

	@Autowired
	RecipeRepository recipeRepo;

	public List<String> getCategoryAll() {
		return recipeRepo.findCategoryAll();
	}

}
