package com.shinhan.naengtureat.store.entity;

import com.shinhan.naengtureat.common.entities.SuperEntity;
import com.shinhan.naengtureat.member.entity.Member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"store", "member"})
public class StoreReview extends SuperEntity {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
	private Long id; // 리뷰 번호
    
    @Column(nullable = false)
    private int rate; // 별점(1~5 사이 정수)
    
    @Column(length = 1000)
    private String comment; // 리뷰 내용
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
}
