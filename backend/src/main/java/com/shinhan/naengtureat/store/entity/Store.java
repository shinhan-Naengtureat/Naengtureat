package com.shinhan.naengtureat.store.entity;

import java.util.List;

import com.shinhan.naengtureat.common.entities.SuperEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Store extends SuperEntity {
	@Id
    @Column(name = "store_id")
    private Long id; // 카카오 지도 API에서 제공하는 값 사용
    
    @Column(name = "store_image", nullable = false)
    private String image; // 이미지 URL(또는 default)
    
    @Column(nullable = false)
    private String placeName; // 스토어 이름
    
    @Column(nullable = false)
    private double x; // x 좌표(경도)
    
    @Column(nullable = false)
    private double y; // y 좌표(위도)
    
    private String phone; // 전화번호
    
    @Column(nullable = false, length = 100)
    private String roadAddressName; // 도로명 주소
    
    @Column(nullable = false)
    private String placeUrl; // http://place.map.kakao.com/16618597
    
    @OneToMany(mappedBy = "store", fetch = FetchType.LAZY)
    private List<StoreReview> storeReviewList; // 스토어 리뷰 리스트
}