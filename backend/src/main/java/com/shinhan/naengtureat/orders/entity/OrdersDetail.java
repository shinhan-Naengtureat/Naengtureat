package com.shinhan.naengtureat.orders.entity;

import com.shinhan.naengtureat.common.entities.SuperEntity;
import com.shinhan.naengtureat.store.entity.StoreProduct;
import jakarta.persistence.*;
import lombok.*;

import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"product", "orders"})
public class OrdersDetail extends SuperEntity {
    @Id
    @Column(name = "orders_detail_id")
    //todo: findLastIdFromDatabase 메서드 구현 필요
    private String id;  //%Y-%m-%d%TP001

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private StoreProduct product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orders_id")
    private Orders orders;

    @Column(nullable = false)
    private int count;

    @Column(nullable = false)
    private int price;

    /**
     * OrdersDetail pk 증가 메서드
     */
    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = generateCustomId();
        }
    }

    private String generateCustomId() {
        // 날짜 포맷
        String datePrefix = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

        // 마지막 ID 조회 및 증가
        String lastId = findLastIdFromDatabase(); // 구현 필요
        int nextSequence = (lastId == null) ? 1 : Integer.parseInt(lastId.substring(13)) + 1; // "TP001" 부분

        // 001 형식 유지
        return datePrefix + "TP" + String.format("%03d", nextSequence);
    }


    private String findLastIdFromDatabase() {
        // 최신 ID 조회 (JPA 또는 Native Query로 구현 필요)
        return null; // 여기에 DB 조회 로직을 추가해야 함
    }
}


