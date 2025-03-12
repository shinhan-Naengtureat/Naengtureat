package com.shinhan.naengtureat.recipe.model;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.entity.Recipe;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

	// 사용자가 작성한 레시피만 조회
    List<Recipe> findByMemberId(Long memberId);
   

	@Query("select distinct category from #{#entityName}")
	List<String> findCategoryAll();

	// 카테고리별 레시피 조회
	public List<Recipe> findByCategory(String category);

	// 삭제되지 않은 레시피만 조회
	Optional<Recipe> findByIdAndIsDeleteFalse(Long recipeId);
	
	// Meal ID로 Recipe를 조회
    Optional<Recipe> findByMealId(Long mealId); 
}
