package com.shinhan.naengtureat.recipe.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.ingredient.model.IngredientRepository;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.dto.MyRecipeDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeIngredientDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeStepDTO;
import com.shinhan.naengtureat.recipe.entity.Hashtag;
import com.shinhan.naengtureat.recipe.entity.Meal;
import com.shinhan.naengtureat.recipe.entity.Recipe;
import com.shinhan.naengtureat.recipe.entity.RecipeHashtag;
import com.shinhan.naengtureat.recipe.entity.RecipeIngredient;
import com.shinhan.naengtureat.recipe.entity.RecipeStep;
import com.shinhan.naengtureat.recipe.vo.RecipeVO;

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

	@Autowired
	private IngredientRepository ingredientRepository;

	// 전체 레시피 조회
	public List<RecipeVO> getAllRecipes() {
		List<Recipe> recipes = recipeRepository.findAll();
		return recipes.stream().map(recipe -> new RecipeVO(entityToDTO(recipe))) // DTO를 VO로 변환
				.collect(Collectors.toList());
	}

	@Transactional
	public void registerRecipe(RecipeDTO recipeDto, Long memberId) {
		// 1. Recipe 생성 및 저장
		Recipe recipe = new Recipe();
		recipe.setName(recipeDto.getName());
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

		// 레시피 먼저 저장
		recipe = recipeRepository.save(recipe);

		// 2. RecipeIngredient 저장 및 가격 계산
		double totalPrice = 0;
		for (RecipeIngredientDTO ingredientDto : recipeDto.getIngredients()) {
			RecipeIngredient recipeIngredient = new RecipeIngredient();
			Ingredient ingredient = ingredientRepository.findById(ingredientDto.getIngredientId()).orElseThrow(
					() -> new IllegalArgumentException("존재하지 않는 재료 ID: " + ingredientDto.getIngredientId()));

			double ingredientPrice = (double) ingredient.getStandardPrice();
			double quantity = ingredientDto.getQuantity();

			totalPrice += (double) (ingredientPrice * quantity);

			recipeIngredient.setIngredient(ingredient);
			recipeIngredient.setRecipe(recipe); // Recipe 저장된 객체 사용
			recipeIngredient.setQuantity((double) quantity);

			recipeIngredientRepository.save(recipeIngredient);
		}

		// 최종 price 설정 후 업데이트
		int roundedTotalPrice = (int) Math.round(totalPrice);
		recipe.setPrice(roundedTotalPrice);
		recipeRepository.save(recipe); // 최종 가격 저장

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
			hashtagIds = new ArrayList<>(); // null 방지
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

	public List<MyRecipeDTO> getMyRecipe(Long memberId) {
	    // 특정 memberId를 가진 레시피 목록 조회
	    List<Recipe> recipeList = recipeRepository.findByMemberId(memberId);

	    // Recipe → MyRecipeDTO 변환
	    return recipeList.stream()
	            .map(recipe -> new MyRecipeDTO(
	                    recipe.getId(),
	                    recipe.getName(),
	                    recipe.getImage(),
	                    recipe.getCategory()
	            ))
	            .collect(Collectors.toList());
	}

	// Member의 나의 Recipe 삭제
	public String deleteMyRecipe(Long memberId, Long recipeId) {
	    // 해당 recipeId로 레시피 조회
	    Recipe recipe = recipeRepository.findById(recipeId)
	            .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다."));

	    // 해당 레시피의 작성자와 로그인된 사용자가 일치하는지 확인
	    if (!recipe.getMember().getId().equals(memberId)) {
	        throw new RuntimeException("본인의 레시피만 삭제할 수 있습니다.");
	    }

	    // 레시피 삭제
	    recipeRepository.deleteById(recipeId);

	    return "레시피 삭제 성공";
	}


	public RecipeDTO entityToDTO(Recipe recipe) {
		ModelMapper mapper = new ModelMapper();
		RecipeDTO dto = mapper.map(recipe, RecipeDTO.class);
		return dto;
	}

}
