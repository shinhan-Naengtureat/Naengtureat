package com.shinhan.naengtureat.mealplan.model;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shinhan.naengtureat.mealplan.entity.MealPlan;
import com.shinhan.naengtureat.member.entity.Member;

import jakarta.transaction.Transactional;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {

	// 식단 일간 조회
	public List<MealPlan> findByMemberAndDate(Member member, LocalDate day);
	
	// 식단 주간, 월간 조회
	public List<MealPlan> findByMemberAndDateBetween(Member member, LocalDate startDate, LocalDate endDate);

	// 저장된 식단 단건 삭제
    @Modifying
    @Query("DELETE FROM MealPlan m WHERE m.id = :mealPlanId AND m.member = :member")
	public int deleteByMemberAndId(@Param("member") Member member, @Param("mealPlanId") Long mealPlanId);

	// 식단 이행여부 체크
	@Modifying
    @Query("UPDATE MealPlan m SET m.isCheck = true WHERE m.id = :mealPlanId AND m.member = :member")
	public int updateMealPlanCheckStatus(@Param("member") Member member, @Param("mealPlanId") Long mealPlanId);
};
