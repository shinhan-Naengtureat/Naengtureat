package com.shinhan.naengtureat.recipe.model;
import java.util.List;
import java.util.Optional;

import com.shinhan.naengtureat.recipe.dto.TopRecipeResponseDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shinhan.naengtureat.recipe.dto.RecipeMainDTO;
import com.shinhan.naengtureat.recipe.entity.Recipe;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

	// 필터 후 레시피 및 관련 정보 조회
	@Query(value = "SELECT r.recipe_id AS id, r.name, " +
		       "CAST(FLOOR(r.price / CAST(SUBSTRING(r.serving, 1, LENGTH(r.serving)-2) AS UNSIGNED)) AS SIGNED) AS price, " +
		       "GROUP_CONCAT(DISTINCT r.category SEPARATOR ', ') AS category, " + 
		       "GROUP_CONCAT(DISTINCT CASE WHEN ing.big_category <> '조미료' THEN ing.small_category END SEPARATOR ', ') AS smallCategory, " +
		       "GROUP_CONCAT(DISTINCT h.keyword SEPARATOR ', ') AS keyword " +
		       "FROM recipe r " +
		       "LEFT JOIN recipe_hashtag hs ON r.recipe_id = hs.recipe_id " +
		       "LEFT JOIN hashtag h ON hs.hashtag_id = h.hashtag_id " +
		       "LEFT JOIN recipe_ingredient ring ON r.recipe_id = ring.recipe_id " +
		       "LEFT JOIN ingredient ing ON ring.ingredient_id = ing.ingredient_id " +
		       "GROUP BY r.recipe_id, r.name, r.price " +
		       "HAVING COUNT(CASE WHEN ing.small_category IN (:excludeIngredients) THEN 1 END) = 0",
		       nativeQuery = true)
		public List<Object[]> findFilteredRecipes(@Param ("excludeIngredients") List<String> excludeIngredients);

	
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

	// 5개 추천순 정렬
	@Query("SELECT new com.shinhan.naengtureat.recipe.dto.TopRecipeResponseDTO( " +
		       "r.id, r.meal.id, r.meal.mealName, r.member.id, r.member.name, r.member.image, " +
		       "r.name, r.price, r.level, r.cookingTime, r.serving, r.image, r.isDelete, " +
		       "CASE WHEN SUM(CASE WHEN l.member.id = :memberId THEN 1 ELSE 0 END) > 0 THEN true ELSE false END) " +
		       "FROM Recipe r " +
		       "LEFT JOIN Likes l ON l.recipe = r " +
		       "GROUP BY r.id, r.meal.id, r.meal.mealName, r.member.id, r.member.name, r.member.image, " +
		       "r.name, r.price, r.level, r.cookingTime, r.serving, r.image, r.isDelete " +
		       "ORDER BY COUNT(l.recipe) DESC")
		List<TopRecipeResponseDTO> findTopByLikes(@Param("memberId") Long memberId, Pageable pageable);

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
	
	@Query("SELECT new com.shinhan.naengtureat.recipe.dto.RecipeMainDTO(" +
		       "r.id, r.name, r.level, r.cookingTime, m.name, r.category, rm.mealName, r.image, r.isDelete, " +
		       "function('group_concat', CONCAT(i.bigCategory, ':', i.smallCategory)), " +
		       "function('group_concat', h.keyword), " +
		       "(SELECT COUNT(l) FROM Likes l WHERE l.recipe = r)) " +
		       "FROM Recipe r " +
		       "JOIN r.member m " +
		       "JOIN r.meal rm " +
		       "LEFT JOIN r.ingredients ri " +
		       "LEFT JOIN ri.ingredient i " +
		       "LEFT JOIN r.hashtags rh " +
		       "LEFT JOIN rh.hashtag h " +
		       "GROUP BY r.id, r.name, r.level, r.cookingTime, m.name, r.category, rm.mealName, r.image, r.isDelete")
		List<RecipeMainDTO> findRecipeMainDTOs();
}