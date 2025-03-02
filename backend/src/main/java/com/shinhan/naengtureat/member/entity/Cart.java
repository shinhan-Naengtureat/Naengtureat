package com.shinhan.naengtureat.member.entity;

import com.shinhan.naengtureat.common.entities.SuperEntity;
import com.shinhan.naengtureat.store.entity.StoreProduct;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Cart extends SuperEntity {
    @Id
    @Column(name = "cart_item_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    int count;

    boolean isCheck;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    StoreProduct productId;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    Member memberId;
}
