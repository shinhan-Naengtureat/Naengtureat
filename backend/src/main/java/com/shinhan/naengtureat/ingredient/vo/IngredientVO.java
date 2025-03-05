package com.shinhan.naengtureat.ingredient.vo;

import com.shinhan.naengtureat.ingredient.dto.IngredientDTO;
import lombok.ToString;
import lombok.Value;

/**
 * @Value: 모든 필드를 private final로 설정 (불변 객체)
 * @ToString: 객체의 내용을 문자열로 변환 (자동 생성)
 */
@Value
@ToString
public class IngredientVO {
    Long id;
    String bigCategory;
    String smallCategory;
    String ingredientUnit;
    String recipeUnit;
    double standardPrice;
    int standardExpDate;
    String standardImage;

    /**
     * DTO를 받아서 VO를 생성하는 생성자 추가
     */
    public IngredientVO(IngredientDTO dto) {
        this.id = dto.getId();
        this.bigCategory = dto.getBigCategory();
        this.smallCategory = dto.getSmallCategory();
        this.ingredientUnit = dto.getIngredientUnit();
        this.recipeUnit = dto.getRecipeUnit();
        this.standardPrice = dto.getStandardPrice();
        this.standardExpDate = dto.getStandardExpDate();
        this.standardImage = dto.getStandardImage();
    }
}
