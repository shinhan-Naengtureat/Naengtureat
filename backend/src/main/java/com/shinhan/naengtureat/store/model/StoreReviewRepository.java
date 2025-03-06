package com.shinhan.naengtureat.store.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.entity.StoreReview;

public interface StoreReviewRepository extends JpaRepository<StoreReview, Long> {

	// 스토어 후기 조회
	List<StoreReview> findAllByStore(Store store);
	
}
