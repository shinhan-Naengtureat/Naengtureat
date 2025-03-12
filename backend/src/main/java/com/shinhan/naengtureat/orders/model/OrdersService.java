package com.shinhan.naengtureat.orders.model;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.orders.dto.OrdersDTO;
import com.shinhan.naengtureat.orders.entity.Orders;

@Service
public class OrdersService {

	@Autowired
	OrdersRepository ordersRepository;

	// 주문할 상품 정보를 orders 테이블에 저장
	public Orders saveOrderInfo(OrdersDTO ordersDTO) {
		String ordersId = generateOrdersId(); // 주문 상세 번호 생성
		ordersDTO.setId(ordersId);

		Orders orderEntity = dtoToEntity(ordersDTO);
		Orders savedEntity = ordersRepository.save(orderEntity);

		return savedEntity;
	}

	// 주문 상세 번호 생성하는 메소드(예: 20250311200519P001)
	private String generateOrdersId() {
		String today = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
		
		// DB에서 가장 최신 ordersId 가져오기
		String lastOrdersId = ordersRepository.findTopByOrderByIdDesc().getId();
		
		// 만약 DB에 기존 주문이 있다면, 마지막 주문 ID에서 카운터 추출
		if (lastOrdersId != null && lastOrdersId.startsWith(today.substring(0, 8))) {
			String counterPart = lastOrdersId.substring(15); // "P" 이후 숫자 추출
			int lastCounter = Integer.parseInt(counterPart);
			
			lastCounter++;
			
			return today + String.format("P%03d", lastCounter);
		} else {
			// DB에 없으면 첫 번째 주문 번호
			return today + "P001";
		}
	}

	// DTO를 Entity로 변환(DB에 반영하기 위함)
	// insert, update 시 사용
	public Orders dtoToEntity(OrdersDTO dto) {
		ModelMapper mapper = new ModelMapper();

		Orders entity = mapper.map(dto, Orders.class);
		Member member = Member.builder().id(dto.getMemberId()).build();
		entity.setMember(member);
		entity.setPaymentDate(LocalDateTime.now());

		return entity;
	}

}
