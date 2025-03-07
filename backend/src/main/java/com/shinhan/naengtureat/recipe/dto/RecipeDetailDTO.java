package com.shinhan.naengtureat.recipe.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecipeDetailDTO {
	private Long id;
    private String name;
    private int price;
    private String level;
    private String cookingTime;
    private String serving;
    private String image;
    private String category;
    private List<RecipeIngredientDTO> ingredients; // 레시피 재료 목록
    private List<RecipeStepDTO> steps; // 조리 과정 목록
    private List<RecipeHashtagDTO> hashtags; // 해시태그 목록
}
