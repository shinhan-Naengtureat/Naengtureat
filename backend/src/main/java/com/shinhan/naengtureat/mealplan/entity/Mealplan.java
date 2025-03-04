package com.shinhan.naengtureat.mealplan.entity;

import java.time.LocalDateTime;

import com.shinhan.naengtureat.common.entities.SuperEntity;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.entity.Recipe;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude= {"member","recipe"})

public class Mealplan extends SuperEntity {
    @Id
    @Column(name="meal_plan_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Long id;//식단ID
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member; //멤버번호
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id",nullable = false)
    private Recipe recipe; // 레시피ID
    
    @Column(nullable = false)
    private LocalDateTime date; // 식단일자
    
    @Column(nullable = false)
    private String type; //식단분류
    
    @Column(nullable = false)
    private Boolean is_check; //이행여부
    

}
