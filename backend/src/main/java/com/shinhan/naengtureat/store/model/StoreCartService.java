package com.shinhan.naengtureat.store.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.member.dto.CartDTO;
import com.shinhan.naengtureat.member.entity.Cart;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.store.dto.IngredientQuantityDTO;
import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.entity.StoreProduct;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StoreCartService {
	
	@Autowired
	StoreCartRepository storeCartRepository;
	
	@Autowired
	StoreProductRepository storeProductRepository;
	
	@Autowired
	StoreRepository storeRepository;
	
	//장바구니 추가(부족한재료-스토어)
	@Transactional
    public List<Map<String, Object>> addMultipleToCart(Long memberId, List<Long> ingredientIds, Long storeId) {
		List<Map<String,Object>> results = new ArrayList<>();
        
		for (Long ingredientId : ingredientIds) {
	        StoreProduct storeProduct = storeProductRepository.findByIngredientIdAndStoreId(ingredientId, storeId)
	                .orElseThrow(() -> new IllegalArgumentException("해당 가게에서 재료 ID " + ingredientId + "를 찾을 수 없습니다."));

	        // 기존 `createCartItem` 메서드를 사용하여 장바구니에 추가
	        results.add(createCartItem(memberId, storeProduct.getId()));
	    }

	    return results;
	}
	
	// 장바구니 조회
	public List<CartDTO> getCartByMemberId(Long memberId) {
		List<CartDTO> cartDTOList = storeCartRepository.findCartDetailsByMemberId(memberId);
		
		// Entity를 DTO로 변환 후 List 형태로 리턴
		return cartDTOList;
	}

	// 장바구니에 재료(상품) 추가
	public Map<String, Object> createCartItem(Long memberId, Long productId) {
		// 로그인 한 사용자의 장바구니에서 해당 상품이 존재하는지 확인
	    Cart existingCartItem = storeCartRepository.findByMemberIdAndProductId(memberId, productId);
	    
	    Cart savedCart;
	    String message;
	    
	    if (existingCartItem != null) {
	    	// 중복된 재료(상품)가 존재하면 count만 +1
	    	existingCartItem.setCount(existingCartItem.getCount() + 1);
	    	savedCart = storeCartRepository.save(existingCartItem);
	    	message = "장바구니에 동일한 상품이 있어 수량을 증가시켰습니다.";
	    } else {
	    	// 존재하지 않으면 새로운 로우로 추가
			Member member = Member.builder().id(memberId).build(); // 로그인 한 사용자의 장바구니에 추가하기 위해
			StoreProduct storeProduct = StoreProduct.builder().id(productId).build(); // 어떤 재료(상품)를 장바구니에 추가할 것인지
			
			// 로그인 한 사용자의 장바구니에 재료(상품) 추가
			Cart cartEntity = Cart.builder()
					.count(1)
					.isCheck(false)
					.member(member)
					.product(storeProduct)
					.build();
			
			savedCart = storeCartRepository.save(cartEntity);
			message = "해당 상품이 장바구니에 추가되었습니다.";
	    }
	    
	    // 반환을 CartDTO 타입으로 하기 위해 cartDTO 생성
	    CartDTO cartDTO = entityToDTO(savedCart);
	    StoreProduct storeProduct = storeProductRepository.findById(productId)
	    		.orElseThrow(() -> new NoSuchElementException("해당 상품을 찾을 수 없습니다."));
	    Store store = storeRepository.findById(storeProduct.getStore().getId())
	    		.orElseThrow(() -> new NoSuchElementException("해당 스토어를 찾을 수 없습니다."));
	    cartDTO.setStoreId(store.getId());
	    cartDTO.setStoreImage(store.getImage());
	    cartDTO.setStorePlaceName(store.getPlaceName());
		
		// 장바구니 추가 성공 여부에 대한 결과 문구와 추가된 내역 정보(savedCart) 리턴
		Map<String, Object> response = new HashMap<>();
		response.put("cartDTO", cartDTO);
		response.put("message", message);
		
		return response;
	}
	
	//장바구니 추가(모자란만큼)
	public List<Map<String, Object>> addMultipleToCartWithQuantity(Long memberId, List<IngredientQuantityDTO> ingredients, Long storeId) {
	    List<Map<String, Object>> result = new ArrayList<>();

	    for (IngredientQuantityDTO iq : ingredients) {
	        Long ingredientId = iq.getIngredientId();
	        int quantity = iq.getQuantity();

	        if (quantity <= 0) continue; // 수량이 0 이하이면 스킵

	        // ingredient_id + store_id로 product_id 조회
	        Long productId = storeProductRepository.findProductIdByIngredientIdAndStoreId(ingredientId, storeId);
	        if (productId == null) {
	            throw new IllegalArgumentException("해당 ingredient와 store에 대한 product가 없습니다.");
	        }

	        // 수량만큼 한 번에 추가
	        result.add(createCartItemWithQuantity(memberId, productId, quantity));
	    }

	    return result;
	}
	//장바구니 다중 증가
	public Map<String, Object> createCartItemWithQuantity(Long memberId, Long productId, int quantity) {
	    if (quantity <= 0) {
	        throw new IllegalArgumentException("수량은 1개 이상이어야 합니다.");
	    }

	    Cart existingCartItem = storeCartRepository.findByMemberIdAndProductId(memberId, productId);

	    Cart savedCart;
	    String message;

	    if (existingCartItem != null) {
	        existingCartItem.setCount(existingCartItem.getCount() + quantity);
	        savedCart = storeCartRepository.save(existingCartItem);
	        message = quantity + "개 수량이 기존 장바구니 항목에 추가되었습니다.";
	    } else {
	        Member member = Member.builder().id(memberId).build();
	        StoreProduct storeProduct = StoreProduct.builder().id(productId).build();

	        Cart cartEntity = Cart.builder()
	                .count(quantity)
	                .isCheck(false)
	                .member(member)
	                .product(storeProduct)
	                .build();

	        savedCart = storeCartRepository.save(cartEntity);
	        message = "장바구니에 " + quantity + "개 상품이 추가되었습니다.";
	    }

	    // DTO 변환 및 store 정보 추가
	    CartDTO cartDTO = entityToDTO(savedCart);
	    StoreProduct storeProduct = storeProductRepository.findById(productId)
	            .orElseThrow(() -> new NoSuchElementException("해당 상품을 찾을 수 없습니다."));
	    Store store = storeRepository.findById(storeProduct.getStore().getId())
	            .orElseThrow(() -> new NoSuchElementException("해당 스토어를 찾을 수 없습니다."));
	    cartDTO.setStoreId(store.getId());
	    cartDTO.setStoreImage(store.getImage());
	    cartDTO.setStorePlaceName(store.getPlaceName());

	    // 응답 Map 구성
	    Map<String, Object> response = new HashMap<>();
	    response.put("cartDTO", cartDTO);
	    response.put("message", message);

	    return response;
	}

	// 장바구니 재료 삭제(단건, 여러 건 둘 다 가능)
	public String deleteCartItems(List<Long> cartIdList) {
		if (cartIdList == null || cartIdList.isEmpty()) {
	        throw new IllegalArgumentException("삭제할 장바구니 아이템 ID가 없습니다.");
	    }
		
		// 리스트 형태인 cartId들을 한 번에 삭제
		storeCartRepository.deleteAllByIdInBatch(cartIdList);
		
		return "장바구니에서 " + cartIdList.size() + "개의 상품이 삭제되었습니다.";
	}
	
	// 장바구니 수량 수정
	public String updateCount(Long cartId, String operation) {
		Cart cartEntity = storeCartRepository.findById(cartId)
				.orElseThrow(() -> new RuntimeException("해당 장바구니 아이템을 찾을 수 없습니다."));
		
		int currentCount = cartEntity.getCount();
		
		if ("increment".equalsIgnoreCase(operation)) {
			cartEntity.setCount(currentCount + 1);
		} else if ("decrement".equalsIgnoreCase(operation)) {
			// 최소 수량 1 이하로 내려가지 않도록 처리
            cartEntity.setCount(currentCount > 1 ? currentCount - 1 : 1);
		} else {
			throw new IllegalArgumentException("유효하지 않은 operation 값입니다.");
		}
		
		// 변경된 수량 저장
		storeCartRepository.save(cartEntity);
		
		return "장바구니 id가 " + cartEntity.getId() + "인 count의 값이 수정되었습니다.";
	}
	
	// Entity를 DTO로 변환
	public CartDTO entityToDTO(Cart entity) {
		CartDTO dto = CartDTO.builder()
				.id(entity.getId())
				.count(entity.getCount())
				.isCheck(entity.isCheck())
				.productId(entity.getProduct().getId())
				.productName(entity.getProduct().getName())
				.productPrice(entity.getProduct().getProductPrice())
				.discountPrice(entity.getProduct().getDiscountPrice())
				.productImage(entity.getProduct().getImage())
				.storeId(null)
				.storeImage(null)
				.storePlaceName(null)
				.build();
		
		return dto;
	}

}
