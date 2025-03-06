package com.shinhan.naengtureat.store.vo;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.store.dto.StoreProductDTO;
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

    /**
     * DTO를 받아서 VO를 생성하는 생성자 추가
     */
    public StoreProductVO(StoreProductDTO dto) {
        this.id = dto.getId();
        this.name = dto.getName();
        this.productPrice = dto.getProductPrice();
        this.discountPrice = dto.getDiscountPrice();
        this.image = dto.getImage();
        this.store = dto.getStore();
        this.ingredient = dto.getIngredient();
    }

}
