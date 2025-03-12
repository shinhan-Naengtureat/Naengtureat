package com.shinhan.naengtureat.orders.model;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.orders.entity.Orders;

public interface OrdersRepository extends JpaRepository<Orders, String> {

	// DB에서 가장 최신 ordersId 가져오기
	Orders findTopByOrderByIdDesc();
	
}
