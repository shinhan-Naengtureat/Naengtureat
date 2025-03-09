package com.shinhan.naengtureat.store.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

}
