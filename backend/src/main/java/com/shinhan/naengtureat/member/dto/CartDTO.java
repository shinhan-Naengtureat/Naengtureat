package com.shinhan.naengtureat.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
public class CartDTO {
	
    private Long id; // 장바구니 번호
    private int count; // 개수
    private boolean isCheck; // 삭제 시 사용되는 체크 여부
    
    private Long productId; // 상품 번호
    private String productName; // 상품 이름
    private int productPrice; // 상품 가격
    private Integer discountPrice; // 할인 가격
    private String productImage; // 상품 이미지
    
    private Long storeId; // 스토어 번호
    private String storeImage; // 스토어 사진
    private String storePlaceName; // 스토어 이름

    public boolean getIsCheck() {
        return this.isCheck;
    }
    
}
