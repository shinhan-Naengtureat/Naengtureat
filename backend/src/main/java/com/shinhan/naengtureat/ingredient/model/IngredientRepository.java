package com.shinhan.naengtureat.ingredient.model;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;

public interface IngredientRepository extends JpaRepository<Ingredient, Long>{
}
