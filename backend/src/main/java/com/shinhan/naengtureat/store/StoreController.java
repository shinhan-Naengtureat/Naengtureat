package com.shinhan.naengtureat.store;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.store.dto.StoreReviewDTO;
import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.model.StoreReviewService;

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
	public ResponseEntity<Object> getStoreReviewByStoreId(@PathVariable("store_id") Long storeId) {
		
		try {
			Store storeEntity = Store.builder().id(storeId).build();
			
			List<StoreReviewDTO> storeReviewDTOList = storeReviewService.getReviewByStore(storeEntity);
			log.info("[storeReviewDTOList] : " + storeReviewDTOList);
			
			return ResponseEntity.ok(storeReviewDTOList);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "스토어 후기 조회 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
		
	}

}
