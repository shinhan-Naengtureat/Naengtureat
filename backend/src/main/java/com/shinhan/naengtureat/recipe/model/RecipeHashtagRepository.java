package com.shinhan.naengtureat.recipe.model;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shinhan.naengtureat.recipe.entity.Hashtag;
import com.shinhan.naengtureat.recipe.entity.RecipeHashtag;

import jakarta.transaction.Transactional;

public interface RecipeHashtagRepository extends JpaRepository<RecipeHashtag, Long> {

	@Query("SELECT DISTINCT h.keyword" + " FROM RecipeHashtag rh " + " JOIN rh.hashtag h ")
	List<String> findThemeAll();

	@Modifying
	@Transactional
	@Query("DELETE FROM RecipeHashtag rh WHERE rh.recipe.id = :recipeId")
	void deleteByRecipeId(@Param("recipeId") Long recipeId);

	@Query("SELECT rh FROM RecipeHashtag rh WHERE rh.recipe.id = :recipeId AND rh.hashtag.id = :hashtagId")
	Optional<RecipeHashtag> findByRecipeIdAndHashtagId(@Param("recipeId") Long recipeId,
			@Param("hashtagId") Long hashtagId);

	// 기존 RecipeHashtag의 해시태그 ID를 업데이트하는 쿼리 수정
	@Modifying
	@Transactional
	@Query("UPDATE RecipeHashtag rh SET rh.hashtag = (SELECT h FROM Hashtag h WHERE h.id = :newHashtagId) WHERE rh.id = :recipeHashtagId")
	void updateHashtagId(@Param("recipeHashtagId") Long recipeHashtagId, @Param("newHashtagId") Long newHashtagId);

}
