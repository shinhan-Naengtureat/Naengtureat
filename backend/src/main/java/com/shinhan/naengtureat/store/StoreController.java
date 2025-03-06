package com.shinhan.naengtureat.store;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.store.entity.StoreReview;
import com.shinhan.naengtureat.store.model.StoreReviewService;
import com.shinhan.naengtureat.store.vo.StoreReviewVO;
import com.shinhan.naengtureat.store.vo.StoreVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/store")
public class StoreController {
	
//	private final StoreService storeService;
	private final StoreReviewService storeReviewService;
	
	// 스토어 후기 조회
	@GetMapping("/{store_id}/review")
	public ResponseEntity<StoreVO> getStoreReviewByStoreId(@PathVariable Long storeId) {
		StoreReview storeReviewEntity = StoreReview.builder().id(storeId).build();
		
		List<StoreVO> storeVOList = storeReviewService.getReviewByStore(storeReviewEntity);
//		StoreReviewVO storeVO =
//		
//		if (storeVO != null) {
//			return ResponseEntity.ok(storeVO);
//		} else {
//			return ResponseEntity.notFound().build();
//		}
		
		return null;
	}

}
