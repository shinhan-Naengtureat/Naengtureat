package com.shinhan.naengtureat.recipe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RecipeIngredientDTO {
	private Long ingredientId; // Ingredient ID
	private double quantity; // 수량
	private String ingredientSmallCategory; //표준재료테이블의 소분류
	private String ingredientRecipeUnit;	//표준재료테이블의 레시피에보여줄단위
}
