package com.shinhan.naengtureat.store;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.member.dto.CartDTO;
import com.shinhan.naengtureat.store.dto.StoreDTO;

import com.shinhan.naengtureat.store.dto.StorePriceDTO;

import com.shinhan.naengtureat.store.dto.StoreProductDTO;
import com.shinhan.naengtureat.store.dto.StoreReviewDTO;
import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.model.StoreCartService;
import com.shinhan.naengtureat.store.model.StoreProductService;
import com.shinhan.naengtureat.store.model.StoreReviewService;
import com.shinhan.naengtureat.store.model.StoreService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/store")
public class StoreController {
	
	private final StoreReviewService storeReviewService;
	private final StoreService storeService;
	private final StoreProductService storeProductService;
	private final StoreCartService storeCartService;
	
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
	

	// 스토어 조회 (부족한 재료 리스트 기반)
    @PostMapping("/emptyproduct")
    public ResponseEntity<?> getStoreListEmptyProduct(@RequestBody Map<String,List<Long>> requestBody) {
        try {
        	
        	List<Long> ingredientIds = requestBody.get("ingredientIds");
            // 1. 요청된 ingredientIds가 비어있거나 null 확인
            if (ingredientIds == null || ingredientIds.isEmpty()) {
                return ResponseEntity.badRequest().body("재료 ID 리스트가 비어 있습니다.");
            }

            // 2. 서비스 호출
            List<StorePriceDTO> storePrices = storeService.getStorePriceList(ingredientIds);

            // 3. 결과가 비어 있을 경우 예외 처리
            if (storePrices.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 재료를 판매하는 스토어가 없습니다.");
            }

            return ResponseEntity.ok(storePrices);
        } catch (Exception e) {
            // 4. 서버 내부 오류 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 오류 발생: " + e.getMessage());
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
	
	// 스토어 재료 카테고리 별 필터링
	@GetMapping("/product")
	public ResponseEntity<Object> getStoreProductByIngredientBigCategory(@RequestParam(name = "bigCategory") String bigCategory) {
		
		try {
			List<StoreProductDTO> storeProductDTOList = storeProductService.getProductByIngredientBigCategory(bigCategory);
			
			return ResponseEntity.ok(storeProductDTOList);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "스토어 재료 필터링 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
		
	}
	
	// 장바구니 조회
	@GetMapping("/cart")
	public ResponseEntity<Object> getCartList() {
		
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 2L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)
			
			List<CartDTO> cartDTOList = storeCartService.getCartByMemberId(memberId);
			
			return ResponseEntity.ok(cartDTOList);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "스토어 장바구니 조회 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
		
	}
	
	// 장바구니 추가
	@PostMapping("/cart/{productId}")
	public ResponseEntity<Object> createCart(@PathVariable("productId") Long productId, @RequestBody StoreProductDTO storeProductDTO) {
		
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 2L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)
			
			Map<String, Object> result = storeCartService.createCartItem(memberId, productId, storeProductDTO);
			
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "스토어 장바구니 추가 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
		
	}
	
	// 장바구니 재료 삭제(단건, 여러 건 둘 다 가능)
	@DeleteMapping("/cart")
	public ResponseEntity<Object> deleteCart(@RequestBody List<Long> cartIdList) {
		
		try {
			// 삭제할 재료(상품)의 cartId를 리스트 형태로 전달
			String result = storeCartService.deleteCartItems(cartIdList);
			
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "스토어 장바구니 재료 삭제 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
		
	}

}
