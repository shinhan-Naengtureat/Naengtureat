package com.shinhan.naengtureat.store.dto;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.store.entity.Store;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreReviewDTO {
	
	private Long id; // 리뷰 번호
    private int rate; // 별점(1~5 사이 정수)
    private String comment; // 리뷰 내용
    private Store store;
    private Member member;

}
