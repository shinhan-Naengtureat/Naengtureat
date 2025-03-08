package com.shinhan.naengtureat.store.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.entity.StoreProduct;

public interface StoreProductRepository extends JpaRepository<StoreProduct, Long> {
	
	// 스토어 상품 조회
	List<StoreProduct> findAllByStore(Store store);

}
