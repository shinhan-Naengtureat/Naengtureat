package com.shinhan.naengtureat.store.model;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.store.entity.Store;

public interface StoreRepository extends JpaRepository<Store, Long> {

}
