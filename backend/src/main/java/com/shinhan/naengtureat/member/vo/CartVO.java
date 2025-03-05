package com.shinhan.naengtureat.member.vo;

import com.shinhan.naengtureat.member.dto.CartDTO;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.store.entity.StoreProduct;
import lombok.ToString;
import lombok.Value;

/**
 * @Value: 모든 필드를 private final로 설정 (불변 객체)
 * @ToString: 객체의 내용을 문자열로 변환 (자동 생성)
 */
@Value
@ToString
public class CartVO {
    Long id;
    int count;
    boolean isCheck;
    StoreProduct product;
    Member member;

    /**
     * DTO를 받아서 VO를 생성하는 생성자 추가
     */
    public CartVO(CartDTO dto) {
        this.id = dto.getId();
        this.count = dto.getCount();
        this.isCheck = dto.getIsCheck();
        this.product = dto.getProduct();
        this.member = dto.getMember();
    }
}
