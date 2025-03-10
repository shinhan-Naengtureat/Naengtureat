package com.shinhan.naengtureat.store.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.member.dto.CartDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StoreCartService {
	
	@Autowired
	StoreCartRepository storeCartRepository;
	
	// 장바구니 조회
	public List<CartDTO> getCartByMemberId(Long memberId) {
		List<CartDTO> cartDTOList = storeCartRepository.findCartDetailsByMemberId(memberId);
		
		// Entity를 DTO로 변환 후 List 형태로 리턴
		return cartDTOList;
	}

}
