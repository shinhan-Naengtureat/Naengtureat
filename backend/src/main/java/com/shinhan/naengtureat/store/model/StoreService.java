package com.shinhan.naengtureat.store.model;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.store.dto.StoreDTO;
import com.shinhan.naengtureat.store.entity.Store;

@Service
public class StoreService {
	
	@Autowired
	StoreRepository storeRepository;

	// 스토어 상세 조회
	public StoreDTO getDetailByStore(Long storeId) {
		Store storeDetail = storeRepository.findById(storeId).orElse(null);
		
		// Entity를 DTO로 변환 후 리턴
		return entityToDTO(storeDetail);
	}
	
	// Entity를 DTO로 변환(Data 전송을 위함, controller, service, view에서 작업)
	// 조회 시 사용
	public StoreDTO entityToDTO(Store entity) {
		ModelMapper mapper = new ModelMapper();
		StoreDTO dto = mapper.map(entity, StoreDTO.class); // 이름이 같은 필드들은 자동으로 매핑
		
		return dto;
	}

}
