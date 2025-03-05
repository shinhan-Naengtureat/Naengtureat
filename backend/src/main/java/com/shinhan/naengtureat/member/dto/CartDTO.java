package com.shinhan.naengtureat.member.dto;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.store.entity.StoreProduct;

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
public class CartDTO {
    private Long id;
    private int count;
    private boolean isCheck;
    private StoreProduct product;
    private Member member;

    public boolean getIsCheck() {
        return this.isCheck;
    }
}
