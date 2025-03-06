package com.shinhan.naengtureat.store.model;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.store.dto.StoreReviewDTO;
import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.entity.StoreReview;

@Service
public class StoreReviewService {
	
	@Autowired
	StoreReviewRepository storeReviewRepository;

	// 스토어 후기 조회
	public List<StoreReviewDTO> getReviewByStore(Store store) {
		List<StoreReview> storeReviewList = storeReviewRepository.findAllByStore(store);
		
		// Entity를 DTO로 변환 후 리턴
		return storeReviewList.stream().map(storeReview -> entityToDTO(storeReview)).toList();
	}
	
	// Entity를 DTO로 변환(Data 전송을 위함, controller, service, view에서 작업)
	// 조회 시 사용
	public StoreReviewDTO entityToDTO(StoreReview entity) {
		ModelMapper mapper = new ModelMapper();
		StoreReviewDTO dto = mapper.map(entity, StoreReviewDTO.class); // 이름이 같은 필드들은 자동으로 매핑
		
		return dto;
	}

}
