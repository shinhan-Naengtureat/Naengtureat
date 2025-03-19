package com.shinhan.naengtureat.orders;

import java.util.ArrayList;
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

import com.shinhan.naengtureat.orders.dto.OrdersDTO;
import com.shinhan.naengtureat.orders.dto.OrdersDetailDTO;
import com.shinhan.naengtureat.orders.dto.OrdersResponseDTO;
import com.shinhan.naengtureat.orders.entity.Orders;
import com.shinhan.naengtureat.orders.entity.OrdersDetail;
import com.shinhan.naengtureat.orders.model.OrdersDetailService;
import com.shinhan.naengtureat.orders.model.OrdersService;
import com.shinhan.naengtureat.store.model.StoreProductService;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/orders")
public class OrdersController {
	
	@Autowired
	OrdersService ordersService;
	
	@Autowired
	OrdersDetailService ordersDetailService;
	
	@Autowired
	StoreProductService storeProductService;
	
	// 장바구니에서 주문하기 클릭 시 주문할 상품 정보 세션에 저장
	@PostMapping("/session")
	public ResponseEntity<Object> createSession(@RequestBody List<OrdersDetailDTO> orderDetailDTOList, HttpSession session) {
		
		try {
			// 세션에 주문할 상품 정보 저장(productId, count, price)
			session.setAttribute("orderDetailDTOList", orderDetailDTOList);
			
			Map<String, String> result = new HashMap<>();
			result.put("message", "주문할 상품 세션에 임시 저장 완료");
			
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "주문할 상품 세션에 임시 저장 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
		
	}
	
	// 결제하기
	@PostMapping("/payment")
	public ResponseEntity<Object> saveOrdersInfo(@RequestBody OrdersDTO ordersDTO, HttpSession session) {
		
		try {
			// ordersDTO : memberId, method, point_pay를 Front 단에서 받아야 함
			
			// 세션에 저장되어 있는 주문할 상품 정보(productId, count, price)
			List<OrdersDetailDTO> orderDetailDTOList = (List<OrdersDetailDTO>) session.getAttribute("orderDetailDTOList");
//			List<OrdersDetailDTO> orderDetailDTOList = new ArrayList<>();
//			orderDetailDTOList.add(OrdersDetailDTO.builder().productId(1L).count(1).price(3000).build());
//			orderDetailDTOList.add(OrdersDetailDTO.builder().productId(2L).count(2).price(10000).build());
			log.info("[orderDetailDTOList] : " + orderDetailDTOList);
			 
	        if (orderDetailDTOList == null) {
	            return ResponseEntity.badRequest().body("임시 주문 정보를 찾을 수 없습니다.");
	        }
	 
	        // 주문할 상품 정보를 각 테이블에 저장
	        Orders savedOrders = ordersService.saveOrderInfo(ordersDTO);
	        // orderDetailDTOList를 Entity로 변환할 때 ordersId를 set 해주기 위해 savedOrders에서 값 가져오기
	        String ordersId = savedOrders.getId();
	        List<OrdersDetail> savedOrdersDetail = ordersDetailService.saveOrderDetailInfo(orderDetailDTOList, ordersId);
	        
	        // 각 OrdersDetail에 대해 응답 DTO 생성
	        List<OrdersResponseDTO> responseDtos = new ArrayList<>();
	        for (OrdersDetail ordersDetail : savedOrdersDetail) {
	        	Long productId = ordersDetail.getProduct().getId();
	        	// productId로 상품 이름과 스토어 이름 조회
	        	OrdersResponseDTO responseDTO = storeProductService.getProductNameAndStoreNameById(productId);
	        	String storePlaceName = responseDTO.getStorePlaceName();
	        	String productName = responseDTO.getProductName();
	        	
	            int ordersDetailCount = ordersDetail.getCount();
	            int ordersDetailPrice = ordersDetail.getPrice();
	            
	            String memberName = savedOrders.getMember().getName();
	            String memberPhone = savedOrders.getMember().getPhone();
	            String memberRoadAddressName = savedOrders.getMember().getRoadAddressName();

	            // OrdersResponseDTO 생성
	            OrdersResponseDTO orderResponseDto = OrdersResponseDTO.builder()
	            		.storePlaceName(storePlaceName)
	                    .ordersPaymentDate(savedOrders.getPaymentDate())
	                    .productName(productName)
	                    .ordersDetailCount(ordersDetailCount)
	                    .ordersDetailPrice(ordersDetailPrice)
	                    .memberName(memberName)
	                    .memberPhone(memberPhone)
	                    .memberRoadAddressName(memberRoadAddressName)
	                    .build();

	            responseDtos.add(orderResponseDto);
	        }
	        
	        return ResponseEntity.ok(responseDtos);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "결제하기 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
		
	}

}