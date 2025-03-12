package com.shinhan.naengtureat.orders.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

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
public class OrdersResponseDTO {
	
	private String storePlaceName; // 스토어 이름
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy년 M월 d일 HH:mm", timezone = "Asia/Seoul")
	private LocalDateTime ordersPaymentDate; // 주문일시
	
	private String productName; // 상품 이름
	private int ordersDetailCount; // 주문한 상품 개수(수량)
	private int ordersDetailPrice; // 주문한 상품 가격
	
	private String memberName; // 주문한 사용자 이름
	private String memberPhone; // 주문한 사용자 전화번호
	private String memberRoadAddressName; // 주문한 사용자 도로명 주소
	
}
