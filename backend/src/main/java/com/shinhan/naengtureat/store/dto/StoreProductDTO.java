package com.shinhan.naengtureat.store.dto;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.store.entity.Store;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreProductDTO {
	
	private Long id; // 스토어 상품 번호
    private String name; // 상품 이름
    private int productPrice; // 상품 가격
    private int discountPrice; // 할인 가격
    private String image; // 상품 이미지
    private Store store;
    private Ingredient ingredient;

}
