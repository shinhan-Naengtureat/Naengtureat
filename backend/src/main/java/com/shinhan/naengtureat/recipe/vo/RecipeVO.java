package com.shinhan.naengtureat.recipe.vo;

import java.util.List;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.pay.dto.PayDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeDTO;
import com.shinhan.naengtureat.recipe.entity.Meal;
import lombok.ToString;
import lombok.Value;

/**
 * @Value: 모든 필드를 private final로 설정 (불변 객체)
 * @ToString: 객체의 내용을 문자열로 변환 (자동 생성)
 */
@Value
@ToString
public class RecipeVO {
    Long id;
    Meal meal;
    Member member;
    String name;
    int price;
    String level;
    String cookingTime;
    String serving;
    String image;
    String category;
    Boolean isDelete;

    /**
     * DTO를 받아서 VO를 생성하는 생성자 추가
     */
    public RecipeVO(RecipeDTO dto) {
        this.id = dto.getId();
        this.meal = dto.getMeal();
        this.member = dto.getMember();
        this.name = dto.getName();
        this.price = dto.getPrice();
        this.level = dto.getLevel();
        this.cookingTime = dto.getCookingTime();
        this.serving = dto.getServing();
        this.image = dto.getImage();
        this.category = dto.getCategory();
        this.isDelete = dto.getIsDelete();
    }
}
