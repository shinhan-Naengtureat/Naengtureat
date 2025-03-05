package com.shinhan.naengtureat.ingredient.entity;

import com.shinhan.naengtureat.common.entities.SuperEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Ingredient extends SuperEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_id")
    private Long id;

    @Column(nullable = false, length = 90)
    private String bigCategory;

    @Column(nullable = false, length = 90)
    private String smallCategory;

    @Column(nullable = false, length = 30)
    private String ingredientUnit;

    @Column(nullable = false, length = 30)
    private String recipeUnit;

    @Column(nullable = false)
    private double standardPrice;

    @Column(nullable = false)
    private int standardExpDate;

    @Column(nullable = false)
    private String standardImage;
}
