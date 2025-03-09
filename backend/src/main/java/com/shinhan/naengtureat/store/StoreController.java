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

import com.shinhan.naengtureat.store.dto.StoreDTO;
import com.shinhan.naengtureat.store.dto.StoreProductDTO;
import com.shinhan.naengtureat.store.dto.StoreReviewDTO;
import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.model.StoreProductService;
import com.shinhan.naengtureat.store.model.StoreReviewService;
import com.shinhan.naengtureat.store.model.StoreService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/store")
public class StoreController {
	
	private final StoreReviewService storeReviewService;
	private final StoreService storeService;
	private final StoreProductService storeProductService;
	
	// 스토어 후기 조회
	@GetMapping("/{storeId}/review")
	public ResponseEntity<Object> getStoreReviewByStoreId(@PathVariable("storeId") Long storeId) {
		
		try {
			Store storeEntity = Store.builder().id(storeId).build();
			
			List<StoreReviewDTO> storeReviewDTOList = storeReviewService.getReviewByStore(storeEntity);
			
			return ResponseEntity.ok(storeReviewDTOList);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "스토어 후기 조회 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
		
	}
	
	// 스토어 상세 조회
	@GetMapping("/{storeId}/detail")
	public ResponseEntity<Object> getStoreDetailByStoreId(@PathVariable("storeId") Long storeId) {
		
		try {
			StoreDTO storeDTO = storeService.getDetailByStore(storeId);
			
			return ResponseEntity.ok(storeDTO);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "스토어 상세 조회 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
		
	}
	
	// 스토어 상품 조회
	@GetMapping("/{storeId}/product")
	public ResponseEntity<Object> getStoreProductByStoreId(@PathVariable("storeId") Long storeId) {
		
		try {
			Store storeEntity = Store.builder().id(storeId).build();
			
			List<StoreProductDTO> storeProductDTOList = storeProductService.getProductByStoreId(storeEntity);
			
			return ResponseEntity.ok(storeProductDTOList);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "스토어 상품 조회 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
		
	}
	
	// 스토어 재료 검색
	@GetMapping("/product/{keyword}")
	public ResponseEntity<Object> searchStoreProductByKeyword(@PathVariable("keyword") String keyword) {
		
		try {
			List<StoreProductDTO> storeProductDTOList = storeProductService.searchProductByKeyword(keyword);
			
			return ResponseEntity.ok(storeProductDTOList);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "스토어 재료 검색 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
		
	}

}
