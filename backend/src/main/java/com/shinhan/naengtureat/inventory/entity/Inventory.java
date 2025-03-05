package com.shinhan.naengtureat.inventory.entity;

import com.shinhan.naengtureat.common.entities.SuperEntity;
import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"member", "ingredient"})
public class Inventory extends SuperEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long id;

    @Column(nullable = false)
    private double quantity;

    @Column(nullable = false, length = 30)
    private String nickName;

    @Column(length = 300)
    private String memo;

    private LocalDate inventoryExpDate;

    @Column(nullable = false)
    private LocalDate inputDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;
}
