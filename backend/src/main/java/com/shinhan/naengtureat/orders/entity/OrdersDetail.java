package com.shinhan.naengtureat.orders.entity;

import com.shinhan.naengtureat.common.entities.SuperEntity;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.pay.entity.Pay;
import com.shinhan.naengtureat.store.entity.StoreProduct;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@ToString(exclude = { "orders" })
public class OrdersDetail extends SuperEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "orders_detail_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)

	@JoinColumn(name = "product_id")
	private StoreProduct storeProduct;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orders_id")
	private Orders orders;
	
	@Column(nullable = false)
	private int count;
	
	@Column(nullable = false)
	private int price;
}