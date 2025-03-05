package com.shinhan.naengtureat.mealplan.entity;

import com.shinhan.naengtureat.common.entities.SuperEntity;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.entity.Recipe;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude= {"member","recipe"})

public class MealPlan extends SuperEntity {
    @Id
    @Column(name="meal_plan_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Long id;//식단ID
    
    @Column(nullable = false)
    private LocalDate date; // 식단일자
    
    @Column(length =10, nullable = false)
    private String type; //식단분류
    
    @Column(nullable = false)
    private boolean isCheck; //이행여부

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member; //멤버번호

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id",nullable = false)
    private Recipe recipe; // 레시피ID
}
