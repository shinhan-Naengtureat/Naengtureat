package com.shinhan.naengtureat.store.model;

import com.shinhan.naengtureat.member.model.MemberRepository;
import com.shinhan.naengtureat.orders.entity.Orders;
import com.shinhan.naengtureat.orders.model.OrdersRepository;
import com.shinhan.naengtureat.store.dto.StoreReviewDTO;
import com.shinhan.naengtureat.store.dto.StoreReviewRequestDTO;
import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.entity.StoreReview;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class StoreReviewService {
	
	@Autowired
	StoreReviewRepository storeReviewRepository;

	ModelMapper mapper = new ModelMapper();
    @Autowired
    private OrdersRepository ordersRepository;
    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private MemberRepository memberRepository;

	// 스토어 후기 조회
	public List<StoreReviewDTO> getReviewByStore(Store store) {
		List<StoreReview> storeReviewList = storeReviewRepository.findAllByStore(store);
		
		// Entity를 DTO로 변환 후 리턴
		return storeReviewList.stream().map(storeReview -> entityToDTO(storeReview)).toList();
	}
	
	// 스토어 리뷰 등록
	@Transactional
	public Map<String, String> createStoreReview(StoreReviewRequestDTO storeReviewRequestDTO) {
		Map<String, String> responseMap = new HashMap<>();

		//1. 주문 내역이 있는지 체크
		Orders orders = ordersRepository.findById(storeReviewRequestDTO.getOrdersId())
				.orElseThrow(() -> new NoSuchElementException("주문 내역이 없습니다."));

		//2. 주문 내역과 매핑되는 리뷰가 있는지 체크 후 리뷰 등록
		if (orders.getStoreReview() == null) {
			StoreReview storeReview = StoreReview.builder()
					.rate(storeReviewRequestDTO.getRate())
					.comment(storeReviewRequestDTO.getComment())
					.store(storeRepository.findById(storeReviewRequestDTO.getStoreId())
							.orElseThrow(() -> new NoSuchElementException("해당 스토어가 없습니다.")))
					.member(memberRepository.findById(storeReviewRequestDTO.getMemberId())
							.orElseThrow(() -> new NoSuchElementException("해당 멤버가 없습니다.")))
					.build();
			StoreReview savedStoreReview = storeReviewRepository.save(storeReview);
			orders.setStoreReview(savedStoreReview);
			responseMap.put("message", "저장이 완료되었습니다.");
		} else {
			responseMap.put("message", "이미 리뷰가 존재합니다.");
		}
		return responseMap;
	}

	// Entity를 DTO로 변환(Data 전송을 위함, controller, service, view에서 작업)
	// 조회 시 사용
	private StoreReviewDTO entityToDTO(StoreReview entity) {
		StoreReviewDTO dto = mapper.map(entity, StoreReviewDTO.class); // 이름이 같은 필드들은 자동으로 매핑

		return dto;
	}

	private StoreReview dtoToEntity(StoreReviewRequestDTO storeReviewDTO) {
		return mapper.map(storeReviewDTO, StoreReview.class);
	}
}
