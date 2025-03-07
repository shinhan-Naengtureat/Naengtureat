package com.shinhan.naengtureat.mealplan.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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

	public List<MealPlanDTO> getDailyMealPlanList(Long memberId, String day) {
		LocalDate localDateDay = LocalDate.parse(day, DateTimeFormatter.ofPattern("yyyyMMdd"));
		Member newMember = Member.builder().id(memberId).build();

		List<MealPlan> dailyMealPlanList = mealPlanRepository.findByMemberAndDate(newMember, localDateDay);

		return dailyMealPlanList.stream().map(mealPlan -> entityToDTO(mealPlan)).collect(Collectors.toList());
	}

	public MealPlanDTO entityToDTO(MealPlan mealPlan) {
		ModelMapper mapper = new ModelMapper();
		MealPlanDTO dto = mapper.map(mealPlan, MealPlanDTO.class);

		return dto;
	}

}
