package com.shinhan.naengtureat.inventory.vo;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.inventory.dto.InventoryDTO;
import com.shinhan.naengtureat.member.entity.Member;
import lombok.ToString;
import lombok.Value;

import java.time.LocalDate;

/**
 * @Value: 모든 필드를 private final로 설정 (불변 객체)
 * @ToString: 객체의 내용을 문자열로 변환 (자동 생성)
 */
@Value
@ToString
public class InventoryVO {
    Long id;
    int quantity;
    String nickName;
    String memo;
    LocalDate inventoryExpDate;
    LocalDate inputDate;
    Member member;
    Ingredient ingredient;

    /**
     * DTO를 받아서 VO를 생성하는 생성자 추가
     */
    public InventoryVO(InventoryDTO dto) {
        this.id = dto.getId();
        this.quantity = dto.getQuantity();
        this.nickName = dto.getNickName();
        this.memo = dto.getMemo();
        this.inventoryExpDate = dto.getInventoryExpDate();
        this.inputDate = dto.getInputDate();
        this.member = dto.getMember();
        this.ingredient = dto.getIngredient();
    }
}