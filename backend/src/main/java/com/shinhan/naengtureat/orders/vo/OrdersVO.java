package com.shinhan.naengtureat.orders.vo;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.orders.dto.OrdersDTO;
import lombok.ToString;
import lombok.Value;

import java.time.LocalDateTime;

/**
 * @Value: 모든 필드를 private final로 설정 (불변 객체)
 * @ToString: 객체의 내용을 문자열로 변환 (자동 생성)
 */
@Value
@ToString
public class OrdersVO {
    Long id;
    Member member;
    String method;
    int pointPay;
    LocalDateTime paymentDate;

    /**
     * DTO를 받아서 VO를 생성하는 생성자 추가
     */
    public OrdersVO(OrdersDTO dto) {
        this.id = dto.getId();
        this.member = dto.getMember();
        this.method = dto.getMethod();
        this.pointPay = dto.getPointPay();
        this.paymentDate = dto.getPaymentDate();
    }
}
