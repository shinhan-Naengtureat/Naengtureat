package com.shinhan.naengtureat.orders.entity;

import com.shinhan.naengtureat.common.entities.SuperEntity;
import com.shinhan.naengtureat.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
}
