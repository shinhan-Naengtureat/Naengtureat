package com.shinhan.naengtureat.mealplan.model;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.mealplan.entity.MealPlan;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {

};
