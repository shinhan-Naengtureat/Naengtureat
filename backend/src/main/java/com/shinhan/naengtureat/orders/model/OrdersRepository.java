package com.shinhan.naengtureat.orders.model;

import com.shinhan.naengtureat.orders.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrdersRepository extends JpaRepository<Orders, String> {
    Optional<Orders> findById(String id);
}
