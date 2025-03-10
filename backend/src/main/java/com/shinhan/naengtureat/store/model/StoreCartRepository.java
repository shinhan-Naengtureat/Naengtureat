package com.shinhan.naengtureat.store.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shinhan.naengtureat.member.dto.CartDTO;
import com.shinhan.naengtureat.member.entity.Cart;

public interface StoreCartRepository extends JpaRepository<Cart, Long> {
	
	// 장바구니 조회
	@Query("SELECT new com.shinhan.naengtureat.member.dto.CartDTO( "
			+ "c.id , c.count, c.isCheck, "
			+ "sp.id, sp.name, sp.productPrice, sp.discountPrice, sp.image, "
			+ "s.id, s.image, s.placeName) "
			+ "FROM Cart c "
			+ "JOIN c.product sp "
			+ "JOIN sp.store s "
			+ "WHERE c.member.id = :memberId")
	List<CartDTO> findCartDetailsByMemberId(@Param("memberId") Long memberId);

}
