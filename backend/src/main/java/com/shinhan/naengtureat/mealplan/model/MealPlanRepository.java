package com.shinhan.naengtureat.mealplan.model;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.mealplan.entity.MealPlan;
import com.shinhan.naengtureat.member.entity.Member;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {

	// 식단 일간 조회
	public List<MealPlan> findByMemberAndDate(Member member, LocalDate day);
};
