package com.shinhan.naengtureat.store.vo;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.store.entity.Store;

import lombok.ToString;
import lombok.Value;

@Value
@ToString
public class StoreReviewVO {
	
	Long id; // 리뷰 번호
    int rate; // 별점(1~5 사이 정수)
    String comment; // 리뷰 내용
    Store store;
    Member member;

}
