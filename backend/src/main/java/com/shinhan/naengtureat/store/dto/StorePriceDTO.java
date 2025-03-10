package com.shinhan.naengtureat.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class StorePriceDTO {
	private String storeName; //상점명
    private Long totalPrice; //상점 총가격
    private Long totalDiscountPrice; //상점 총할인가격
    private String image; // 상점이미지
}
