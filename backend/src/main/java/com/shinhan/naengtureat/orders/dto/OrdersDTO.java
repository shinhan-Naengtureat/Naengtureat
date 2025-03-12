package com.shinhan.naengtureat.orders.dto;

import java.time.LocalDateTime;

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
public class OrdersDTO {
	
    private String id; // 주문 번호
    
    private Long memberId; // 멤버 번호
    
    private String method; // 결제 수단
    private int pointPay; // 포인트 사용액
    private LocalDateTime paymentDate; // 주문일시
    
}
