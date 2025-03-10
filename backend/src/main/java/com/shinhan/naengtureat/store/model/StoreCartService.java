package com.shinhan.naengtureat.store.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.member.dto.CartDTO;
import com.shinhan.naengtureat.member.entity.Cart;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.store.dto.StoreProductDTO;
import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.entity.StoreProduct;

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

	// 장바구니 재료 삭제(단건, 여러 건 둘 다 가능)
	public String deleteCartItems(List<Long> cartIdList) {
		if (cartIdList == null || cartIdList.isEmpty()) {
	        throw new IllegalArgumentException("삭제할 장바구니 아이템 ID가 없습니다.");
	    }
		
		// 리스트 형태인 cartId들을 한 번에 삭제
		storeCartRepository.deleteAllByIdInBatch(cartIdList);
		
		return "장바구니에서 " + cartIdList.size() + "개의 상품이 삭제되었습니다.";
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
