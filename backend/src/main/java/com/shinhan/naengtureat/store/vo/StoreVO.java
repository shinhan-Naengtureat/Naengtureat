package com.shinhan.naengtureat.store.vo;

import com.shinhan.naengtureat.store.dto.StoreDTO;

import lombok.ToString;
import lombok.Value;

/**
 * @Value: 모든 필드를 private final로 설정 (불변 객체)
 * @ToString: 객체의 내용을 문자열로 변환 (자동 생성)
 */
@Value
@ToString
public class StoreVO {
    Long id; // 카카오 지도 API에서 제공하는 값 사용
    String image; // 이미지 URL(또는 default)
    String placeName; // 스토어 이름
    double x; // x 좌표(경도)
    double y; // y 좌표(위도)
    String phone; // 전화번호
    String roadAddressName; // 도로명 주소
    String placeUrl; // http://place.map.kakao.com/16618597

    /**
     * DTO를 받아서 VO를 생성하는 생성자 추가
     */
    public StoreVO(StoreDTO dto) {
        this.id = dto.getId();
        this.image = dto.getImage();
        this.placeName = dto.getPlaceName();
        this.x = dto.getX();
        this.y = dto.getY();
        this.phone = dto.getPhone();
        this.roadAddressName = dto.getRoadAddressName();
        this.placeUrl = dto.getPlaceUrl();
    }
}
