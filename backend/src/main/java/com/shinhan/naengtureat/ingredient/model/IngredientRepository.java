package com.shinhan.naengtureat.ingredient.model;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

}
