package com.shinhan.naengtureat.store.model;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.store.dto.StoreProductDTO;
import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.entity.StoreProduct;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StoreProductService {
	
	@Autowired
	StoreProductRepository storeProductRepository;

	// 스토어 상품 조회
	public List<StoreProductDTO> getProductByStoreId(Store store) {
		List<StoreProduct> storeProductList = storeProductRepository.findAllByStore(store);
		
		// Entity를 DTO로 변환 후 리턴
		return storeProductList.stream().map(storeProduct -> entityToDTO(storeProduct)).toList();
	}
	
	// Entity를 DTO로 변환(Data 전송을 위함, controller, service, view에서 작업)
	// 조회 시 사용
	public StoreProductDTO entityToDTO(StoreProduct entity) {
		ModelMapper mapper = new ModelMapper();
		StoreProductDTO dto = mapper.map(entity, StoreProductDTO.class); // 이름이 같은 필드들은 자동으로 매핑
		
		return dto;
	}

}
