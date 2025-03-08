package com.shinhan.naengtureat.store.entity;

import com.shinhan.naengtureat.common.entities.SuperEntity;
import com.shinhan.naengtureat.ingredient.entity.Ingredient;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"store", "ingredient"})
public class StoreProduct extends SuperEntity {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
	private Long id; // 스토어 상품 번호
    
    @Column(name = "product_name", nullable = false)
    private String name; // 상품 이름
    
    @Column(nullable = false)
    private int productPrice; // 상품 가격
    
    private Integer discountPrice; // 할인 가격
    
    @Column(name = "product_image")
    private String image; // 상품 이미지
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;
}
