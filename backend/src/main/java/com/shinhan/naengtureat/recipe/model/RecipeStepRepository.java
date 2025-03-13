package com.shinhan.naengtureat.recipe.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shinhan.naengtureat.recipe.entity.RecipeStep;

import jakarta.transaction.Transactional;

public interface RecipeStepRepository extends JpaRepository<RecipeStep, Long> {

	@Modifying
	@Transactional
	@Query("DELETE FROM RecipeStep rs WHERE rs.recipe.id = :recipeId")
	void deleteByRecipeId(@Param("recipeId") Long recipeId);
}
