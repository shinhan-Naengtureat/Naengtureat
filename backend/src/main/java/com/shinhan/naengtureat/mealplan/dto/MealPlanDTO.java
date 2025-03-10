package com.shinhan.naengtureat.mealplan.dto;

import java.time.LocalDate;

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
public class MealPlanDTO {
	private Long id; // 식단ID

	private Long recipeId; // 레시피ID
	private String recipeName; // 레시피이름

	private LocalDate date; // 식단일자
	private String type; // 식단분류
	private boolean isCheck; // 이행여부
}
