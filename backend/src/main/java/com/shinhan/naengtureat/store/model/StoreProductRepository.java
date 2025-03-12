package com.shinhan.naengtureat.store.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shinhan.naengtureat.store.dto.StorePriceDTO;
import com.shinhan.naengtureat.store.entity.Store;
import com.shinhan.naengtureat.store.entity.StoreProduct;

public interface StoreProductRepository extends JpaRepository<StoreProduct, Long> {

	// 스토어 상품 조회
	List<StoreProduct> findAllByStore(Store store);
	
	// 스토어 재료 검색
	@Query("SELECT sp FROM StoreProduct sp "
			+ "JOIN sp.ingredient i "
			+ "WHERE sp.name LIKE CONCAT('%', :keyword, '%') OR i.smallCategory LIKE CONCAT('%', :keyword, '%')")
	List<StoreProduct> findProductByKeyword(@Param("keyword") String keyword);
	
	// 스토어 재료 카테고리 별 필터링
	List<StoreProduct> findByIngredient_BigCategoryIn(List<String> bigCategory);

	@Query("SELECT new com.shinhan.naengtureat.store.dto.StorePriceDTO(s.placeName, "
			+ " SUM(p.productPrice), "
			+ " SUM(COALESCE(p.discountPrice,0)), s.image) "
			+ " FROM Store s "
			+ " JOIN StoreProduct p ON s.id = p.store.id "
			+ " WHERE p.ingredient.id IN :ingredientIds "
			+ " GROUP BY s.placeName, s.image "
			+ " ORDER BY SUM(COALESCE(p.discountPrice,0)) ")
	List<StorePriceDTO> findStorePricesByIngredients(@Param("ingredientIds") List<Long> ingredientIds);
}
