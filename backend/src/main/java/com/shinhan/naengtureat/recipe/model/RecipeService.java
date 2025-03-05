package com.shinhan.naengtureat.recipe.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.dto.RecipeDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeIngredientDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeStepDTO;
import com.shinhan.naengtureat.recipe.entity.Hashtag;
import com.shinhan.naengtureat.recipe.entity.Meal;
import com.shinhan.naengtureat.recipe.entity.Recipe;
import com.shinhan.naengtureat.recipe.entity.RecipeHashtag;
import com.shinhan.naengtureat.recipe.entity.RecipeIngredient;
import com.shinhan.naengtureat.recipe.entity.RecipeStep;

import jakarta.transaction.Transactional;

@Service
public class RecipeService {

	@Autowired
	private RecipeRepository recipeRepository;
	
	@Autowired
	private RecipeStepRepository recipeStepRepository;

	@Autowired
	private RecipeIngredientRepository recipeIngredientRepository;
	
	@Autowired
	private RecipeHashtagRepository recipeHashtagRepository;
	
	 
	@Transactional
	public void registerRecipe(RecipeDTO recipeDto, Long memberId) {
		// 1. Recipe 생성 및 저장
		Recipe recipe = new Recipe();
		recipe.setName(recipeDto.getName());
		recipe.setPrice(recipeDto.getPrice());
		recipe.setLevel(recipeDto.getLevel());
		recipe.setCookingTime(recipeDto.getCookingTime());
		recipe.setServing(recipeDto.getServing());
		recipe.setImage(recipeDto.getImage());
		recipe.setCategory(recipeDto.getCategory());

		// Meal 설정
		Meal meal = new Meal();
		meal.setId(recipeDto.getMeal().getId());
		recipe.setMeal(meal);

		// Member 설정
		Member member = new Member();
		member.setId(memberId);
		recipe.setMember(member);

		// 레시피 저장
		recipeRepository.save(recipe);

		// 2. RecipeIngredient 저장
		for (RecipeIngredientDTO ingredientDto : recipeDto.getIngredients()) {
			RecipeIngredient recipeIngredient = new RecipeIngredient();
			Ingredient ingredient = new Ingredient();
			ingredient.setId(ingredientDto.getIngredientId());
			recipeIngredient.setIngredient(ingredient);
			recipeIngredient.setRecipe(recipe);
			recipeIngredient.setQuantity(ingredientDto.getQuantity());
			recipeIngredientRepository.save(recipeIngredient);
		}

		// 3. RecipeStep 저장
		for (RecipeStepDTO stepDto : recipeDto.getSteps()) {
			RecipeStep recipeStep = new RecipeStep();
			recipeStep.setRecipe(recipe);
			recipeStep.setContent(stepDto.getContent());
			recipeStep.setImage(stepDto.getImage());
			recipeStepRepository.save(recipeStep);
		}

		// 4. RecipeHashtag 저장
		 List<Long> hashtagIds = recipeDto.getHashtagIds();
		    if (hashtagIds == null) {
		        hashtagIds = new ArrayList<>(); // null일 경우 빈 리스트로 처리
		    }
		for (Long hashtagId : hashtagIds) {
			RecipeHashtag recipeHashtag = new RecipeHashtag();
			Hashtag hashtag = new Hashtag();
			hashtag.setId(hashtagId);
			recipeHashtag.setRecipe(recipe);
			recipeHashtag.setHashtag(hashtag);
			recipeHashtagRepository.save(recipeHashtag);
		}
	}
}
