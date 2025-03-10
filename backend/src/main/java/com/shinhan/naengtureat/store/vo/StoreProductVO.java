package com.shinhan.naengtureat.store.vo;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.store.entity.Store;

import lombok.ToString;
import lombok.Value;

@Value
@ToString
public class StoreProductVO {
	
	Long id; // 스토어 상품 번호
    String name; // 상품 이름
    int productPrice; // 상품 가격
    int discountPrice; // 할인 가격
    String image; // 상품 이미지
    Store store;
    Ingredient ingredient;

}
