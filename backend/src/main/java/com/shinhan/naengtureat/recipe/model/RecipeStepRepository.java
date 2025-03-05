package com.shinhan.naengtureat.recipe.model;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.recipe.entity.RecipeStep;

public interface RecipeStepRepository extends JpaRepository<RecipeStep, Long>{
}
