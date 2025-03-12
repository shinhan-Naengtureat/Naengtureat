package com.shinhan.naengtureat.recipe.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.ingredient.model.IngredientRepository;
import com.shinhan.naengtureat.mealplan.dto.MealPlanDTO;
import com.shinhan.naengtureat.mealplan.entity.MealPlan;
import com.shinhan.naengtureat.mealplan.model.MealPlanRepository;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.member.model.MemberRepository;
import com.shinhan.naengtureat.recipe.dto.CommentDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeDetailDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeHashtagDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeIngredientDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeStepDTO;
import com.shinhan.naengtureat.recipe.entity.Comment;
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

	@Autowired
	private IngredientRepository ingredientRepository;

	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private MemberRepository memberRepository;

	@Autowired
	private MealPlanRepository mealPlanRepository;

	// 전체 레시피 조회
	public List<RecipeDTO> getAllRecipes() {
		List<Recipe> recipes = recipeRepository.findAll();
		System.out.println(recipes);
		return recipes.stream().map(recipe -> entityToDTO(recipe)).collect(Collectors.toList());
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
		meal.setId(recipeDto.getMealId());
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

	// Member의 Recipe 조회
	public List<Recipe> findRecipeByMember(Member member) {
		return recipeRepository.findByMember(member);
	}

	@Transactional
	public CommentDTO addComment(Long recipeId, Long memberId, String content) {
		Recipe recipe = recipeRepository.findById(recipeId).orElseThrow(() -> new RuntimeException("Recipe not found"));
		Member member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));

		Comment comment = Comment.builder().recipe(recipe).member(member).content(content).build();

		commentRepository.save(comment);

		return new CommentDTO(comment.getId(), comment.getContent(), comment.getMember().getName()); // memberName 추가
	}

	@Transactional
	public CommentDTO updateComment(Long commentId, CommentDTO commentDto) {
		Comment comment = commentRepository.findById(commentId).orElse(null);
		comment.setContent(commentDto.getContent());
		commentRepository.save(comment);

		// CommentDTO로 변환하여 반환
		return new CommentDTO(comment.getId(), comment.getContent(), comment.getMember().getName());
	}

	public void deleteComment(Long commentId) {
		commentRepository.deleteById(commentId);
	}

	@Transactional
	public List<CommentDTO> getComments(Long recipeId) {
		List<Comment> comments = commentRepository.findByRecipeId(recipeId);

		return comments.stream().map(comment -> entityToDTO(comment)).collect(Collectors.toList());
	}

	// 카테고리별 레시피 조회
	public List<RecipeDTO> getRecipesByCategory(String category) {
		// 카테고리에 해당하는 레시피 목록 조회
		List<Recipe> recipes = recipeRepository.findByCategory(category);

		// Recipe 엔티티를 RecipeDTO로 변환하여 반환
		return recipes.stream().map(recipe -> entityToDTO(recipe)).collect(Collectors.toList());
	}

	@Transactional
	public RecipeDetailDTO getRecipeDetail(Long recipeId) {

		ModelMapper mapper = new ModelMapper();
		Recipe recipe = recipeRepository.findById(recipeId)
				.orElseThrow(() -> new IllegalArgumentException("레시피가 존재하지 않습니다."));

		RecipeDetailDTO recipeDetailDTO = mapper.map(recipe, RecipeDetailDTO.class);

		recipeDetailDTO.setIngredients(recipe.getIngredients().stream()
				.map(ri -> mapper.map(ri, RecipeIngredientDTO.class)).collect(Collectors.toList()));

		recipeDetailDTO.setSteps(recipe.getSteps().stream().map(step -> mapper.map(step, RecipeStepDTO.class))
				.collect(Collectors.toList()));

		recipeDetailDTO.setHashtags(recipe.getHashtags().stream().map(ht -> mapper.map(ht, RecipeHashtagDTO.class))
				.collect(Collectors.toList()));

		return recipeDetailDTO;
	}

	public RecipeDTO entityToDTO(Recipe recipe) {
		ModelMapper mapper = new ModelMapper();
		RecipeDTO dto = mapper.map(recipe, RecipeDTO.class);
		return dto;
	}

	public CommentDTO entityToDTO(Comment comment) {
		ModelMapper mapper = new ModelMapper();
		CommentDTO dto = mapper.map(comment, CommentDTO.class);
		return dto;
	}

	@Transactional
	public MealPlanDTO createOrUpdateMealPlan(Long memberId, Long recipeId, LocalDate date, String type) {
		Optional<MealPlan> existingMealPlan = mealPlanRepository.findByMemberIdAndDateAndType(memberId, date, type);
		existingMealPlan.ifPresent(mealPlanRepository::delete);

		Member member = memberRepository.findById(memberId)
				.orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다."));
		Recipe recipe = recipeRepository.findById(recipeId)
				.orElseThrow(() -> new IllegalArgumentException("해당 레시피가 존재하지 않습니다."));

		MealPlan newMealPlan = MealPlan.builder().member(member).recipe(recipe).date(date).type(type).isCheck(false)
				.build();

		MealPlan savedMealPlan = mealPlanRepository.save(newMealPlan);

		// Hibernate 프록시 초기화 방지
		Long savedRecipeId = savedMealPlan.getRecipe() != null ? savedMealPlan.getRecipe().getId() : null;
		String savedRecipeName = savedMealPlan.getRecipe() != null ? savedMealPlan.getRecipe().getName() : null;

		return new MealPlanDTO(savedMealPlan.getId(), savedRecipeId, savedRecipeName, savedMealPlan.getDate(),
				savedMealPlan.getType(), savedMealPlan.isCheck());
	}

	@Transactional
	public List<RecipeDTO> getRecipesByBigCategory(List<String> bigCategories) {
		// RecipeRepository의 메서드를 통해 해당 bigCategories에 해당하는 Recipe 목록 조회
		List<Recipe> recipes = recipeRepository.findDistinctByIngredients_Ingredient_BigCategoryIn(bigCategories);
		return recipes.stream().map(this::entityToDTO).collect(Collectors.toList());
	}

	@Transactional
	public List<RecipeDTO> getRecipesSorted(String sortType) {
		List<Recipe> recipes;

		switch (sortType.toLowerCase()) {
		case "recommend":
			// 추천순: 좋아요 수 기준 내림차순
			recipes = recipeRepository.findAllOrderByLikesCountDesc();
			break;
		case "latest":
			// 최신순(등록일순): id가 순차적으로 생기기때문에 id내림차순으로 정렬함
			recipes = recipeRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
			break;
		case "difficulty":
			// 난이도순: level 필드 기준 오름차순
			recipes = recipeRepository.findAll(Sort.by(Sort.Direction.DESC, "level"));
			break;
		case "cookingtime":
            // 조리시간순: 커스텀 정렬 로직을 통해 cookingTime을 실제 분 단위로 변환하여 오름차순 정렬
            recipes = recipeRepository.findAll();
            recipes.sort(Comparator.comparingInt(r -> convertCookingTimeToMinutes(r.getCookingTime())));
            break;
		default:
			// sortType이 올바르지 않으면 전체 조회
			recipes = recipeRepository.findAll();
			break;
		}

		return recipes.stream().map(this::entityToDTO).collect(Collectors.toList());
	}
	
	// 조리시간순으로 정렬하기 위해 15분이내, 2시간이내 같이 저장되어있는 데이터를 int로 바꿔주는 함수
	private int convertCookingTimeToMinutes(String cookingTime) {
        if (cookingTime == null || cookingTime.isEmpty()) {
            return Integer.MAX_VALUE; // 정렬 시 뒤로 배치
        }
        try {
            if (cookingTime.contains("분 이내")) {
                String numStr = cookingTime.replace("분 이내", "").trim();
                return Integer.parseInt(numStr);
            } else if (cookingTime.contains("시간 이내")) {
                String numStr = cookingTime.replace("시간 이내", "").trim();
                return Integer.parseInt(numStr) * 60;
            } else {
                return Integer.MAX_VALUE;
            }
        } catch (NumberFormatException e) {
            return Integer.MAX_VALUE;
        }
    }
}
