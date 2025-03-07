package com.shinhan.naengtureat.mealplan.model;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.mealplan.dto.MealPlanDTO;
import com.shinhan.naengtureat.mealplan.entity.MealPlan;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.model.RecipeHashtagRepository;
import com.shinhan.naengtureat.recipe.model.RecipeRepository;

@Service
public class MealPlanService {

	@Autowired
	RecipeRepository recipeRepository;

	@Autowired
	RecipeHashtagRepository recipeHashRepository;

	@Autowired
	MealPlanRepository mealPlanRepository;

	public List<String> getCategoryAll() {
		return recipeRepository.findCategoryAll();
	}

	public List<String> getThemeAll() {
		return recipeHashRepository.findThemeAll();
	}

	// 식단 일간 조회
	public List<MealPlanDTO> getDailyMealPlanList(Long memberId, String day) {
		LocalDate localDateDay = LocalDate.parse(day, DateTimeFormatter.ofPattern("yyyyMMdd"));
		Member newMember = Member.builder().id(memberId).build();

		List<MealPlan> dailyMealPlanList = mealPlanRepository.findByMemberAndDate(newMember, localDateDay);

		return dailyMealPlanList.stream().map(mealPlan -> entityToDTO(mealPlan)).collect(Collectors.toList());
	}
	
	// 식단 월간 조회
	public List<MealPlanDTO> getMonthlyMealPlanList(Long memberId, String month) {
		YearMonth ym = YearMonth.parse(month, DateTimeFormatter.ofPattern("yyyyMM"));
        
        
        LocalDate startDate = ym.atDay(1); // LocalDate의 첫날로 변환
		LocalDate endDate = ym.atEndOfMonth(); // LocalDate의 마지막날로 변환
		Member newMember = Member.builder().id(memberId).build();
		
		List<MealPlan> monthlyMealPlanList = mealPlanRepository.findByMemberAndDateBetween(newMember, startDate, endDate);
		
		return monthlyMealPlanList.stream().map(mealPlan -> entityToDTO(mealPlan)).collect(Collectors.toList());
	}

	// 식단 주간 조회
	public List<MealPlanDTO> getWeeklyMealPlanList(Long memberId, String day) {
		LocalDate localDateDay = LocalDate.parse(day, DateTimeFormatter.ofPattern("yyyyMMdd"));
		
        
        LocalDate startOfWeek = localDateDay.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)); // 이번 주의 시작일 (월요일)
        LocalDate endOfWeek = localDateDay.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)); // 이번 주의 종료일 (일요일)
		Member newMember = Member.builder().id(memberId).build();
		
		List<MealPlan> weeklyMealPlanList = mealPlanRepository.findByMemberAndDateBetween(newMember, startOfWeek, endOfWeek);
		
		return weeklyMealPlanList.stream().map(mealPlan -> entityToDTO(mealPlan)).collect(Collectors.toList());
	}
	
	public MealPlanDTO entityToDTO(MealPlan mealPlan) {
		ModelMapper mapper = new ModelMapper();
		MealPlanDTO dto = mapper.map(mealPlan, MealPlanDTO.class);

		return dto;
	}

}
