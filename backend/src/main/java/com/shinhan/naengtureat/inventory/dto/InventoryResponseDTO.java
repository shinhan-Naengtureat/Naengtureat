package com.shinhan.naengtureat.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponseDTO {
    private double quantity;
    private String nickName;
    private String memo;
    private LocalDate inventoryExpDate;
    private LocalDate inputDate;
    private Long memberId;  //멤버 아이디
    private Long ingredientId;  //재료 아이디
    private String ingredientName;  //재료 이름
    private int remainingDays;  //소비기한 D-day값
}
