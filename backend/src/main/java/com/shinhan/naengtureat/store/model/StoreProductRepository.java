package com.shinhan.naengtureat.store.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.shinhan.naengtureat.store.dto.StorePriceDTO;
import com.shinhan.naengtureat.store.entity.StoreProduct;

@Repository
public interface StoreProductRepository extends JpaRepository<StoreProduct, Long> {

	@Query("SELECT new com.example.dto.StorePriceDTO(s.storeName,"
			+ " SUM(p.productPrice),"
			+ " SUM(p.discountPrice), s.image) "
			+ " FROM Store s " 
			+ " JOIN StoreProduct p ON s.id = p.store.id "
			+ " WHERE sp.ingredient.id IN :ingredientIds "
			+ " GROUP BY s.storeName, s.image "
			+ " ORDER BY SUM(p.discountPrice) ")
	List<StorePriceDTO> findStorePricesByIngredients(@Param("ingredientIds") List<Long> ingredientIds);
}
