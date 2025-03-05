package com.shinhan.naengtureat.mealplan.vo;

import java.time.LocalDate;

import com.shinhan.naengtureat.mealplan.dto.MealPlanDTO;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.entity.Recipe;

import lombok.ToString;
import lombok.Value;

/**
 * @Value: 모든 필드를 private final로 설정 (불변 객체)
 * @ToString: 객체의 내용을 문자열로 변환 (자동 생성)
 */
@Value
@ToString
public class MealPlanVO {
    Long id;//식단ID
    Member member; //멤버번호
    Recipe recipe; // 레시피ID
    LocalDate date; // 식단일자
    String type; //식단분류
    boolean isCheck; //이행여부

    /**
     * DTO를 받아서 VO를 생성하는 생성자 추가
     */
    public MealPlanVO(MealPlanDTO dto) {
        this.id = dto.getId();
        this.member = dto.getMember();
        this.recipe = dto.getRecipe();
        this.date = dto.getDate();
        this.type = dto.getType();
        this.isCheck = dto.getIsCheck();
    }
}
