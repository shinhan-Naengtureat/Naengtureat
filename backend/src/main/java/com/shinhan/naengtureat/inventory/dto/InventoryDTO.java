package com.shinhan.naengtureat.inventory.dto;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

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
public class InventoryDTO {
    private Long id;
    private double quantity;
    private String nickName;
    private String memo;
    private LocalDate inventoryExpDate;
    private LocalDate inputDate;
    private Long memberId;
    private Long ingredientId;
}
