package com.shinhan.naengtureat.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
public class StoreReviewRequestDTO {
    private String comment; // 리뷰 내용
    private int rate; // 별점(1~5 사이 정수)
    private Long storeId; // 스토어 번호
    private Long memberId;  // 멤버 번호
    private String ordersId;  //주문번호
}
