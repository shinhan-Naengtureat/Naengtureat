package com.shinhan.naengtureat.ingredient.model;

import com.shinhan.naengtureat.ingredient.dto.CategoryResponseDTO;
import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    @Query("SELECT new com.shinhan.naengtureat.ingredient.dto.CategoryResponseDTO(i.bigCategory, i.smallCategory, i.ingredientUnit) FROM Ingredient i")
    List<CategoryResponseDTO> findAllCategories();
}