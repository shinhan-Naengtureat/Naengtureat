package com.shinhan.naengtureat.store.model;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.store.entity.Store;

public interface StoreRepository extends JpaRepository<Store, Long> {
	
	Optional<Store> findById(Long storeId);

}
