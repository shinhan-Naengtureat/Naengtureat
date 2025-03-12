package com.shinhan.naengtureat.store.model;

import java.util.Arrays;
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
		
		// Entity를 DTO로 변환 후 List 형태로 리턴
		return storeProductList.stream().map(storeProduct -> entityToDTO(storeProduct)).toList();
	}
	
	// 스토어 재료 검색
	public List<StoreProductDTO> searchProductByKeyword(String keyword) {
		// store 테이블의 name, store_product 테이블의 small_category에 keyword가 포함된 목록 조회
		List<StoreProduct> storeProductList = storeProductRepository.findProductByKeyword(keyword);
		
		// Entity를 DTO로 변환 후 List 형태로 리턴
		return storeProductList.stream().map(storeProduct -> entityToDTO(storeProduct)).toList();
	}
	
	// 스토어 재료 카테고리 별 필터링
	public List<StoreProductDTO> getProductByIngredientBigCategory(String bigCategory) {
		List<String> bigCategoryList = Arrays.asList(bigCategory.split(",")); // ex) "과일,고기"를 ["과일", "고기"]로 변환
		
		List<StoreProduct> storeProductList = storeProductRepository.findByIngredient_BigCategoryIn(bigCategoryList);
		
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
