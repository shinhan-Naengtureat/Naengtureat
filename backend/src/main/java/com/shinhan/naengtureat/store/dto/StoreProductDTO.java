package com.shinhan.naengtureat.store.dto;

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
    private Integer discountPrice; // 할인 가격
    private String image; // 상품 이미지
    
    private Long storeId; // 스토어 번호
    private String storeImage; // 스토어 사진
    private String storePlaceName; // 스토어 이름
    
    private Long ingredientId; // 재료 번호
    private String ingredientBigCategory; // 재료 대분류(필터링에 사용)

}
