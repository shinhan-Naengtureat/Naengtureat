package com.shinhan.naengtureat.ingredient.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class IngredientComparisonDTO {
	 private Long memberIngredientId;  // 사용자가 가지고 있는 재료 ID (NULL일 수도 있음)
	 private Integer memberQuantity;  // 사용자가 보유한 재료 개수
	 private String ingredientName; // 재료명
	 private Long mealPlanIngredientId;  // 필요한 재료 ID
	 private Integer mealPlanQuantity;  // 필요한 재료 개수
	private String recipeName; // 레시피명 
}
