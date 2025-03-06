package com.shinhan.naengtureat.store.model;

import java.util.List;

import com.shinhan.naengtureat.store.entity.StoreReview;

public interface StoreReviewRepository {

	// 스토어 후기 조회
	List<StoreReview> findByStore(StoreReview storeReviewEntity);

}
