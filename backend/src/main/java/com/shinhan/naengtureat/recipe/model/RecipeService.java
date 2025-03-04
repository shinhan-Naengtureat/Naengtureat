package com.shinhan.naengtureat.recipe.model;

import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.recipe.entity.Recipe;
import com.shinhan.naengtureat.recipe.entity.RecipeStep;

@Service
public class RecipeService {
	
	private RecipeRepository recipeRepository;
	
	private RecipeStepRepository recipeStepRepository;
	
	// 레시피 개요 등록
	public Recipe insertRecipe(Recipe recipe) {
		return recipeRepository.save(recipe);
	}
	
	//레시피 재료 등록
	
	//레시피 순서 등록
	public RecipeStep insertRecipeStep(RecipeStep recipeStep) {
		return recipeStepRepository.save(recipeStep);
	}
	
	//해시태그 등록
}
