package com.shinhan.naengtureat.ingredient.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_id")
    private Long id;

    @Column(nullable = false, length = 90)
    private String bigCategory;

    @Column(nullable = false, length = 90)
    private String smallCategory;

    @Column(nullable = false, length = 30)
    private String amountUnit;

    @Column(nullable = false)
    private int standardPrice;

    @Column(nullable = false)
    private int standardExpDate;
}
