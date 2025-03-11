package com.shinhan.naengtureat.orders;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.orders.dto.OrderDetailDTO;
import com.shinhan.naengtureat.orders.model.OrdersService;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/orders")
public class OrdersController {
	
	@Autowired
	OrdersService ordersService;
	
	// 장바구니에서 주문하기 클릭 시 주문할 상품 정보 세션에 저장
	@PostMapping("/create")
	public ResponseEntity<Object> createOrder(@RequestBody List<OrderDetailDTO> orderDetailDTOList, HttpSession session) {
		
		try {
			// 세션에 주문할 상품 정보 저장(productId, count, price)
			session.setAttribute("orderDetailDTOList", orderDetailDTOList);
			
			return ResponseEntity.ok("주문할 상품 세션에 임시 저장 완료.");
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "주문할 상품 세션에 임시 저장 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
		
	}

}
