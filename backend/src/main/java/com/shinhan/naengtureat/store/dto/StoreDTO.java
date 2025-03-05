package com.shinhan.naengtureat.store.dto;

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
public class StoreDTO {
    private Long id; // 카카오 지도 API에서 제공하는 값 사용
    private String image; // 이미지 URL(또는 default)
    private String placeName; // 스토어 이름
    private double x; // x 좌표(경도)
    private double y; // y 좌표(위도)
    private String phone; // 전화번호
    private String roadAddressName; // 도로명 주소
    private String placeUrl; // http://place.map.kakao.com/16618597
}
