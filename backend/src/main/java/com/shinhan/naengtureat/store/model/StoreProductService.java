package com.shinhan.naengtureat.store.model;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.inventory.dto.InventoryRequestDTO;
import com.shinhan.naengtureat.inventory.model.InventoryService;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.orders.dto.OrdersResponseDTO;
import com.shinhan.naengtureat.store.dto.StoreProductDTO;
import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.entity.StoreProduct;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StoreProductService {
	
	@Autowired
	StoreProductRepository storeProductRepository;
	
	@Autowired
	InventoryService inventoryService;

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
	
	// productId로 상품 이름과 스토어 이름 조회(OrdersController에서 사용)
	public OrdersResponseDTO getProductNameAndStoreNameById(Long productId) {
		StoreProduct storeProduct = storeProductRepository.findById(productId)
				.orElseThrow(() -> new NoSuchElementException(productId + "번(productId)의 상품을 찾을 수 없습니다."));
		
		String productName = storeProduct.getName();
		String storePlaceName = storeProduct.getStore().getPlaceName();
		
		OrdersResponseDTO responseDTO = OrdersResponseDTO.builder()
				.productName(productName)
				.storePlaceName(storePlaceName)
				.build();
		
		return responseDTO;
	}
	
	// Entity를 DTO로 변환(Data 전송을 위함, controller, service, view에서 작업)
	// 조회 시 사용
	public StoreProductDTO entityToDTO(StoreProduct entity) {
		ModelMapper mapper = new ModelMapper();
		StoreProductDTO dto = mapper.map(entity, StoreProductDTO.class); // 이름이 같은 필드들은 자동으로 매핑
		
		return dto;
	}
	
	public void addProductToInventory(Long productId, Member member, int quantity) {
        // 1. productId를 통해 StoreProduct 엔티티 조회
        StoreProduct storeProduct = storeProductRepository.findById(productId)
            .orElseThrow(() -> new NoSuchElementException("상품을 찾을 수 없습니다."));
        
        // 2. 연결된 Ingredient의 ID와 관련 정보를 추출
        Long ingredientId = storeProduct.getIngredient().getId();
        
        // 3. InventoryRequestDTO 구성
        InventoryRequestDTO inventoryRequestDTO = new InventoryRequestDTO();
        inventoryRequestDTO.setMemberId(member.getId());
        inventoryRequestDTO.setIngredientId(ingredientId);
        inventoryRequestDTO.setQuantity(quantity);
        inventoryRequestDTO.setInputDate(LocalDate.now());
        inventoryRequestDTO.setNickName(storeProduct.getIngredient().getSmallCategory());
        
        // 오늘 기준으로 ingredient의 standardExpDate(일수)를 더해서 유통기한 계산
        LocalDate inventoryExpDate = LocalDate.now().plusDays(storeProduct.getIngredient().getStandardExpDate());
        inventoryRequestDTO.setInventoryExpDate(inventoryExpDate);
        
        // 4. InventoryService를 통해 인벤토리에 추가
        inventoryService.createInventory(inventoryRequestDTO);
    }
}
