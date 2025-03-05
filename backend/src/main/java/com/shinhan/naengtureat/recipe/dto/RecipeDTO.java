package com.shinhan.naengtureat.recipe.dto;

import java.util.List;

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
public class RecipeDTO {
	private String name;
	private int price;
	private String level;
	private String cookingTime;
	private String serving;
	private String image;
	private String category;
	private Long mealId; // Meal ID
	private Long memberId; // Member ID
	private List<RecipeIngredientDTO> ingredients; // 레시피 재료
	private List<RecipeStepDTO> steps; // 레시피 순서
	private List<Long> hashtagIds; // 해시태그 ID 리스트
}
