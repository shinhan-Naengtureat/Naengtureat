package com.shinhan.naengtureat.ingredient.dto;

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
public class IngredientDTO {
    private Long id;
    private String bigCategory;
    private String smallCategory;
    private String ingredientUnit;
    private String recipeUnit;
    private double standardPrice;
    private int standardExpDate;
    private String standardImage;
}