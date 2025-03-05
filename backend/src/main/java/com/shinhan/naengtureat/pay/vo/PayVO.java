package com.shinhan.naengtureat.pay.vo;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.orders.dto.OrdersDTO;
import com.shinhan.naengtureat.pay.dto.PayDTO;
import lombok.ToString;
import lombok.Value;

/**
 * @Value: 모든 필드를 private final로 설정 (불변 객체)
 * @ToString: 객체의 내용을 문자열로 변환 (자동 생성)
 */
@Value
@ToString
public class PayVO {
    Long id;
    Member member;
    int balance;
    String customerUid;

    /**
     * DTO를 받아서 VO를 생성하는 생성자 추가
     */
    public PayVO(PayDTO dto) {
        this.id = dto.getId();
        this.member = dto.getMember();
        this.balance = dto.getBalance();
        this.customerUid = dto.getCustomerUid();
    }
}
