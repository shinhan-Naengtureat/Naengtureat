package com.shinhan.naengtureat.recipe.model;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.entity.Recipe;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

	// 사용자가 작성한 레시피 중 삭제되지 않은 레시피만 조회
	@Query("SELECT r FROM Recipe r WHERE r.member.id = :memberId AND r.isDelete = false")
	List<Recipe> findByMemberId(@Param("memberId") Long memberId);

	@Query("select distinct category from #{#entityName}")
	public List<String> findCategoryAll();

	// 카테고리별 레시피 조회
	public List<Recipe> findByCategory(String category);

	// 삭제되지 않은 레시피만 조회
	Optional<Recipe> findByIdAndIsDeleteFalse(Long recipeId);

	// Meal ID로 Recipe를 조회
	Optional<Recipe> findByMealId(Long mealId);

	public Optional<Recipe> findById(Long recipeId);

	// 대분류 필터
	public List<Recipe> findDistinctByIngredients_Ingredient_BigCategoryIn(List<String> bigCategories);

	// 추천순 정렬
	@Query("SELECT r FROM Recipe r LEFT JOIN Likes l ON l.recipe = r GROUP BY r ORDER BY COUNT(l) DESC")
	List<Recipe> findAllOrderByLikesCountDesc();

	// 검색 기능
	@Query("SELECT DISTINCT r FROM Recipe r " + "LEFT JOIN r.hashtags rh " + "LEFT JOIN rh.hashtag h "
			+ "LEFT JOIN r.ingredients ri " + "LEFT JOIN ri.ingredient i " + "LEFT JOIN r.meal m "
			+ "WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) "
			+ "OR LOWER(h.keyword) LIKE LOWER(CONCAT('%', :keyword, '%')) "
			+ "OR LOWER(i.smallCategory) LIKE LOWER(CONCAT('%', :keyword, '%')) "
			+ "OR LOWER(m.mealName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
	List<Recipe> searchRecipes(@Param("keyword") String keyword);
	
	// 카테고리 필터(한식,중식 등)
	List<Recipe> findByCategoryIn(List<String> categories);

}