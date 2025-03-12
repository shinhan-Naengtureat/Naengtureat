package com.shinhan.naengtureat.orders.model;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.orders.dto.OrdersDetailDTO;
import com.shinhan.naengtureat.orders.entity.Orders;
import com.shinhan.naengtureat.orders.entity.OrdersDetail;
import com.shinhan.naengtureat.store.entity.StoreProduct;

@Service
public class OrdersDetailService {

	@Autowired
	OrdersDetailRepository ordersDetailRepository;

	// 주문할 상품 정보를 orders_detail 테이블에 저장
	public List<OrdersDetail> saveOrderDetailInfo(List<OrdersDetailDTO> ordersDetailDTOList, String ordersId) {
		// DTO 리스트를 Entity 리스트로 변환
		List<OrdersDetail> ordersDetailEntity = ordersDetailDTOList.stream()
				.map(ordersDetailDTO -> dtoToEntity(ordersDetailDTO, ordersId)).toList();
		
		List<OrdersDetail> savedEntityList = ordersDetailRepository.saveAll(ordersDetailEntity);
		
		return savedEntityList;
	}

	// DTO를 Entity로 변환(DB에 반영하기 위함)
	// insert, update 시 사용
	public OrdersDetail dtoToEntity(OrdersDetailDTO dto, String ordersId) {
		ModelMapper mapper = new ModelMapper();

		OrdersDetail entity = mapper.map(dto, OrdersDetail.class);
		StoreProduct storeProduct = StoreProduct.builder().id(dto.getProductId()).build();
		Orders orders = Orders.builder().id(ordersId).build();
		entity.setProduct(storeProduct);
		entity.setOrders(orders);

		return entity;
	}

}
