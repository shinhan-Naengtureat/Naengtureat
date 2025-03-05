package com.shinhan.naengtureat.recipe;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
import com.shinhan.naengtureat.recipe.model.RecipeService;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/recipe")
public class RecipeController {
	
	@Autowired
	RecipeService recipeService;
	
	@PostMapping("/new")
	public ResponseEntity<String> insertRecipe(@RequestBody RecipeDTO recipeDto, HttpSession session) {
        try {
            // 세션에서 로그인된 사용자 정보 가져오기
            Long memberId = (Long)session.getAttribute("memberId");

            // 1. Recipe 객체 생성
            Recipe recipe = new Recipe();
            recipe.setName(recipeDto.getName());
            recipe.setPrice(recipeDto.getPrice());
            recipe.setLevel(recipeDto.getLevel());
            recipe.setCookingTime(recipeDto.getCookingTime());
            recipe.setServing(recipeDto.getServing());
            recipe.setImage(recipeDto.getImage());
            recipe.setCategory(recipeDto.getCategory());

            // 2. Meal과 Member 설정
            Meal meal = new Meal(); 
            meal.setId(recipeDto.getMealId()); 
            recipe.setMeal(meal);

            Member member = new Member(); 
            member.setId(memberId); // 세션에서 가져온 memberId 설정
            recipe.setMember(member);

            // 3. Recipe 저장
            recipeService.insertRecipe(recipe);

            // 4. RecipeIngredient 객체 생성 및 저장
            for (RecipeIngredientDTO ingredientDto : recipeDto.getIngredients()) {
                RecipeIngredient recipeIngredient = new RecipeIngredient();
                Ingredient ingredient = new Ingredient(); // Ingredient 객체 설정
                ingredient.setId(ingredientDto.getIngredientId());
                recipeIngredient.setIngredient(ingredient);
                recipeIngredient.setRecipe(recipe);
                recipeIngredient.setQuantity(ingredientDto.getQuantity());
                recipeService.insertRecipeIngredient(recipeIngredient);
            }

            // 5. RecipeStep 객체 생성 및 저장
            for (RecipeStepDTO stepDto : recipeDto.getSteps()) {
                RecipeStep recipeStep = new RecipeStep();
                recipeStep.setRecipe(recipe);
                recipeStep.setContent(stepDto.getContent());
                recipeStep.setImage(stepDto.getImage());
                recipeService.insertRecipeStep(recipeStep);
            }

            // 6. RecipeHashtag 객체 생성 및 저장
            for (Long hashtagId : recipeDto.getHashtagIds()) {
                RecipeHashtag recipeHashtag = new RecipeHashtag();
                Hashtag hashtag = new Hashtag(); // Hashtag 객체 설정
                hashtag.setId(hashtagId);
                recipeHashtag.setRecipe(recipe);
                recipeHashtag.setHashtag(hashtag);
                recipeService.insertRecipeHashtag(recipeHashtag);
            }
            return new ResponseEntity<>("레시피가 성공적으로 등록되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("레시피 등록 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
