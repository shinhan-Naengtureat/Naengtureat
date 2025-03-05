package com.shinhan.naengtureat.recipe.model;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.recipe.entity.Recipe;

public interface RecipeRepository extends JpaRepository<Recipe, Long>{
}
