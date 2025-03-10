package com.shinhan.naengtureat.store.model;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shinhan.naengtureat.store.dto.StoreDTO;
import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.entity.StoreReview;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StoreService {
	
	@Autowired
	StoreRepository storeRepository;

	// 스토어 상세 조회
	@Transactional
	public StoreDTO getDetailByStore(Long storeId) {
		Store storeDetail = storeRepository.findById(storeId).orElse(null);
		
		List<StoreReview> storeReviewList = storeDetail.getStoreReviewList();
		
		double rateAvg = 0.0;
		int reviewCount = 0;
		
		if (storeReviewList != null && !storeReviewList.isEmpty()) {
			// 스토어 리뷰 별점 평균 계산
			rateAvg = storeDetail.getStoreReviewList().stream()
					.mapToInt(StoreReview::getRate) // rate 값만 추출
					.average() // 평균 계산
					.orElse(0.0); // 값이 없을 경우 기본값 0.0
			
			// 스토어 리뷰 갯수
			reviewCount = storeDetail.getStoreReviewList().size();
		}
		
		StoreDTO storeDTO = entityToDTO(storeDetail); // Entity를 DTO로 변환
		storeDTO.setRateAvg(rateAvg); // 별점 정보를 storeDTO에 저장
		storeDTO.setReviewCount(reviewCount); // 리뷰 갯수를 storeDTO에 저장
		
		return storeDTO;
	}
	
	// Entity를 DTO로 변환(Data 전송을 위함, controller, service, view에서 작업)
	// 조회 시 사용
	public StoreDTO entityToDTO(Store entity) {
		ModelMapper mapper = new ModelMapper();
		StoreDTO dto = mapper.map(entity, StoreDTO.class); // 이름이 같은 필드들은 자동으로 매핑
		
		return dto;
	}

}
