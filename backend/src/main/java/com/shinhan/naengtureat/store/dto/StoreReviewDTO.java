package com.shinhan.naengtureat.store.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class StoreReviewDTO {
	
	private Long id; // 리뷰 번호
    private int rate; // 별점(1~5 사이 정수)
    private String comment; // 리뷰 내용
    private LocalDateTime updateDate; // 리뷰 최종 수정일
    
    private Long storeId; // 스토어 번호
    private String storePlaceName; // 스토어 이름
    
    private Long memberId; // 멤버 번호
    private String memberImage; // 멤버 프로필 사진
    private String memberName; // 멤버 이름

}
