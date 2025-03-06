package com.shinhan.naengtureat.inventory.model;

import com.shinhan.naengtureat.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

}