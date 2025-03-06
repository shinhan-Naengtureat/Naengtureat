package com.shinhan.naengtureat.store.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.store.entity.StoreReview;
import com.shinhan.naengtureat.store.vo.StoreVO;

@Service
public class StoreReviewService {
	
	@Autowired
	StoreReviewRepository storeReviewRepository;

	// 스토어 후기 조회
	public List<StoreVO> getReviewByStore(StoreReview storeReviewEntity) {
		List<StoreReview> storeReviewList = storeReviewRepository.findByStore(storeReviewEntity);
		
		return null;
	}

}
