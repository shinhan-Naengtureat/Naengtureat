package com.shinhan.naengtureat.orders.entity;

import java.time.LocalDateTime;

import com.shinhan.naengtureat.common.entities.SuperEntity;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.store.entity.StoreReview;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"member"})
public class Orders extends SuperEntity {
	@Id
	@Column(name = "orders_id")
	private String id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;
	
	@Column(nullable = false, length = 30)
	private String method;
	
	@Column(nullable = false)
	private int pointPay;
	
	@Column(nullable = false)
	private LocalDateTime paymentDate;

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "store_review_id")
	private StoreReview storeReview;
}
