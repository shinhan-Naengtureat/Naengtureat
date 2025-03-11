package com.shinhan.naengtureat.orders.dto;

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
public class OrderDetailDTO {
	
	private String id; // 주문 상세 번호

    private Long productId; // 스토어 상품 번호

    private Long ordersId; // 주문 번호

    private int count; // 주문할 상품 개수
    private int price; // 주문할 상품 가격

}
