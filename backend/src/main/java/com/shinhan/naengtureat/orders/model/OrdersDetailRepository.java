package com.shinhan.naengtureat.orders.model;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.orders.entity.OrdersDetail;

public interface OrdersDetailRepository extends JpaRepository<OrdersDetail, Long> {

}
