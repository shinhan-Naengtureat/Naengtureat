package com.shinhan.naengtureat.mealplan.model;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shinhan.naengtureat.mealplan.entity.MealPlan;
import com.shinhan.naengtureat.member.entity.Member;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {

	// 식단 일간 조회
	public List<MealPlan> findByMemberAndDate(Member member, LocalDate day);

	// 내가 선택한 date,type에 이미 data가 있는지 확인
	@Query("SELECT m FROM MealPlan m WHERE m.member.id = :memberId AND m.date = :date AND m.type = :type")
	Optional<MealPlan> findByMemberIdAndDateAndType(@Param("memberId") Long memberId, 
													@Param("date") LocalDate date,
													@Param("type") String type);
};
