package com.shinhan.naengtureat.recipe.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shinhan.naengtureat.recipe.entity.RecipeIngredient;

import jakarta.transaction.Transactional;

public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient,Long> {
	@Modifying
    @Transactional
    @Query("DELETE FROM RecipeIngredient ri WHERE ri.recipe.id = :recipeId")
    void deleteByRecipeId(@Param("recipeId") Long recipeId);
}
