package com.shinhan.naengtureat.recipe.dto;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Data: Getter, Setter, toString, equals, hashCode, RequiredArgsConstructor 자동 생성
 * @NoArgsConstructor: 기본 생성자 생성
 * @AllArgsConstructor: 모든 필드를 포함한 생성자 생성
 * @Builder: 빌더 패턴 지원
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

