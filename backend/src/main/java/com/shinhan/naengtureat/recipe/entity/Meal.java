package com.shinhan.naengtureat.recipe.entity;

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
public class Meal extends SuperEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meal_id")
    private Long id;

    @Column(name = "meal_name", nullable = false)
    private String mealName;

}