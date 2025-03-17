package com.shinhan.naengtureat.recipe.model;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.recipe.entity.Meal;

public interface MealRepository extends JpaRepository<Meal, Long>{

}
