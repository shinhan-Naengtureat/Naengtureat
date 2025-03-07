package com.shinhan.naengtureat.recipe.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.ingredient.model.IngredientRepository;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.member.model.MemberRepository;
import com.shinhan.naengtureat.recipe.dto.CommentDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeDTO;
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

	// 전체 레시피 조회
	public List<RecipeDTO> getAllRecipes() {
		List<Recipe> recipes = recipeRepository.findAll();
		System.out.println(recipes);
		return recipes.stream().map(recipe -> entityToDTO(recipe))
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
	
	
	//Member의 Recipe 조회	
	public List<Recipe> findRecipeByMember(Member member) {
		return recipeRepository.findByMember(member);
	} 

	@Transactional
	public CommentDTO addComment(Long recipeId, Long memberId, String content) {
	    Recipe recipe = recipeRepository.findById(recipeId)
	        .orElseThrow(() -> new RuntimeException("Recipe not found"));
	    Member member = memberRepository.findById(memberId)
	        .orElseThrow(() -> new RuntimeException("Member not found"));

	    Comment comment = Comment.builder()
	        .recipe(recipe)
	        .member(member)
	        .content(content)
	        .build();
	    
	    commentRepository.save(comment);

	    return new CommentDTO(comment.getId(),comment.getContent(), comment.getMember().getName()); // memberName 추가
	}

	@Transactional
	public CommentDTO updateComment(Long commentId, CommentDTO commentDto) {
	    Comment comment = commentRepository.findById(commentId).orElse(null);
	    comment.setContent(commentDto.getContent());
	    commentRepository.save(comment);

	    // CommentDTO로 변환하여 반환
	    return new CommentDTO(comment.getId(),comment.getContent(), comment.getMember().getName());
	}
	
	public void deleteComment(Long commentId) {
		commentRepository.deleteById(commentId);
	}
	
	@Transactional
	public List<CommentDTO> getComments(Long recipeId) {
	    List<Comment> comments = commentRepository.findByRecipeId(recipeId);
	    
	    return comments.stream()
	            .map(comment -> entityToDTO(comment)) 
	            .collect(Collectors.toList());
	}
	
	// 카테고리별 레시피 조회
    public List<RecipeDTO> getRecipesByCategory(String category) {
        // 카테고리에 해당하는 레시피 목록 조회
        List<Recipe> recipes = recipeRepository.findByCategory(category);

        // Recipe 엔티티를 RecipeDTO로 변환하여 반환
        return recipes.stream().map(recipe -> entityToDTO(recipe)).collect(Collectors.toList());
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
}
