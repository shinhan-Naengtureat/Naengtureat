package com.shinhan.naengtureat.mealplan.model;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.inventory.entity.Inventory;
import com.shinhan.naengtureat.inventory.model.InventoryRepository;
import com.shinhan.naengtureat.mealplan.dto.MealPlanDTO;
import com.shinhan.naengtureat.mealplan.dto.MonthlyMealPlanDTO;
import com.shinhan.naengtureat.mealplan.entity.MealPlan;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.member.model.MemberRepository;
import com.shinhan.naengtureat.recipe.entity.Recipe;
import com.shinhan.naengtureat.recipe.entity.RecipeIngredient;
import com.shinhan.naengtureat.recipe.model.RecipeHashtagRepository;
import com.shinhan.naengtureat.recipe.model.RecipeRepository;

import jakarta.transaction.Transactional;

@Service
public class MealPlanService {

	@Autowired
	RecipeRepository recipeRepository;

	@Autowired
	RecipeHashtagRepository recipeHashRepository;

	@Autowired
	MealPlanRepository mealPlanRepository;
	
	@Autowired
	MemberRepository memberRepository;
	
	@Autowired
	InventoryRepository inventoryRepository;
	
//	@Transactional
//    public void saveMealPlan(List<MealPlanDTO> mealplanDTO) {
//		Member member = memberRepository.findById(3L)
//				.orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다."));
//		
//		List<MealPlan> existingMealPlans = mealPlanRepository.findByMemberId(member.getId());
//		
//		 List<MealPlan> newMealPlans = mealplanDTO.stream()
//				 .filter(dto ->
//				 existingMealPlans.stream()
//                 .noneMatch(meal -> meal.getDate().equals(dto.getDate()) && meal.getType().equals(dto.getType()))
//	         ).map(dto -> {
//			Recipe recipe = recipeRepository.findById(dto.getRecipeId())
//					.orElseThrow(() -> new IllegalArgumentException("해당 레시피가 존재하지 않습니다."));
//			 return MealPlan.builder()
//                 .member(member)  // Member 객체 사용
//                 .recipe(recipe)  // Recipe 객체 사용
//                 .date(dto.getDate()) 
//                 .type(dto.getType()) 
//                 .isCheck(false) 
//                 .build();
//	         	}).collect(Collectors.toList());
//
//		// 🔹 3. 새로운 식단이 있다면 저장
//		    if (!newMealPlans.isEmpty()) {
//		        mealPlanRepository.saveAll(newMealPlans);
//		    }
//    }
//	

	
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
	public List<MonthlyMealPlanDTO> getMonthlyMealPlanList(Long memberId, String month) {
		YearMonth ym = YearMonth.parse(month, DateTimeFormatter.ofPattern("yyyyMM"));
        
        
        LocalDate startDate = ym.atDay(1); // LocalDate의 첫날로 변환
		LocalDate endDate = ym.atEndOfMonth(); // LocalDate의 마지막날로 변환
		Member newMember = Member.builder().id(memberId).build();
		
		List<MealPlan> monthlyMealPlanList = mealPlanRepository.findByMemberAndDateBetween(newMember, startDate, endDate);
		
		return monthlyMealPlanList.stream().map(mealPlan -> entityToDTO2(mealPlan)).collect(Collectors.toList());
	}
	
	// 저장된 식단 단건 삭제
	@Transactional
	public String deleteMealPlan(Long memberId, Long mealPlanId) {
		Member newMember = Member.builder().id(memberId).build();
		
		int result = mealPlanRepository.deleteByMemberAndId(newMember, mealPlanId);
		
		if(result == 1) {
			return "재료 삭제가 완료되었습니다.";
		} else {
			return "재료 삭제에 실패하였습니다.";
		}
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
	
	// 식단 이행여부 체크
	@Transactional
	public String checkMealPlan(Long memberId, Long mealPlanId) {
		Member newMember = Member.builder().id(memberId).build();
		
		int result = mealPlanRepository.updateMealPlanCheckStatus(newMember, mealPlanId);
		
		if(result == 1) {
			// 1. 회원 포인트 5점 추가
	        Member memberEntity = memberRepository.findById(memberId).orElse(null);
	        memberEntity.setPoint(memberEntity.getPoint() + 5);
	        memberRepository.save(memberEntity);
	        
	        //2. 레시피재료만큼 인벤토리 재료 삭제
	        MealPlan mealPlan = mealPlanRepository.findById(mealPlanId).orElse(null);
	        Recipe recipe = mealPlan.getRecipe();
	        
	     // 식단의 레시피에 포함된 재료들을 순회하며 회원 인벤토리에서 차감
	        for (RecipeIngredient ri : recipe.getIngredients()) {
	        	String smallCategory = ri.getIngredient().getSmallCategory();
	        	String recipeUnit = ri.getIngredient().getRecipeUnit();
	        	String ingredientUnit = ri.getIngredient().getIngredientUnit();
	        	
	        	// 수량체크안하는 것들
	        	if(smallCategory.equals("조미료")||smallCategory.equals("견과류")||smallCategory.equals("곡물")||
	        	   smallCategory.equals("기타")||(!recipeUnit.equals(ingredientUnit))) {
	        		continue;
	        	}
	        	
	            Long ingredientId = ri.getIngredient().getId();

	            // 회원 인벤토리 조회
	            Inventory inventory = inventoryRepository.findByMemberIdAndIngredientId(memberId, ingredientId);
	            
	            if(inventory != null) {
	            	double newQuantity = inventory.getQuantity() - ri.getQuantity();
		            
	            	if(newQuantity<=0) {
	            		//남은 수량이 0이하면 인벤토리에서 재료 삭제
	            		inventoryRepository.delete(inventory);
	            	} else {
	            		//남은 수량이 0보다 크면 업데이트 후 저장
	            		inventory.setQuantity(newQuantity);
	            		inventoryRepository.save(inventory);
	            	}
	            }
	        }
			return "식단 이행여부 체크, 포인트 업데이트, 인벤토리 차감이 완료되었습니다.";
		} else {
			return "식단 이행여부 체크에 실패하였습니다.";
		}
	}
	
	// 저장된 식단 이동
	public String updateMealPlan(Long memberId, MealPlanDTO mealPlanDTO) {
		Member newMember = Member.builder().id(memberId).build();

		Optional<MealPlan> optionalMealPlan = mealPlanRepository.findById(mealPlanDTO.getId());

        if (optionalMealPlan.isPresent()) {
            MealPlan mealPlan = optionalMealPlan.get();

            mealPlan.setDate(mealPlanDTO.getDate());   // 날짜 변경
            mealPlan.setType(mealPlanDTO.getType());   // 식단 타입 변경

            mealPlanRepository.save(mealPlan); // 변경 사항 저장
            return "저장된 식단 이동이 완료되었습니다.";
        }
        return "저장된 식단 이동에 실패하였습니다.";
	}
	
	public MealPlanDTO entityToDTO(MealPlan mealPlan) {
		ModelMapper mapper = new ModelMapper();
		MealPlanDTO dto = mapper.map(mealPlan, MealPlanDTO.class);

		return dto;
	}
	
	public MonthlyMealPlanDTO entityToDTO2(MealPlan mealPlan) {
		ModelMapper mapper = new ModelMapper();
		MonthlyMealPlanDTO dto = mapper.map(mealPlan, MonthlyMealPlanDTO.class);

		return dto;
	}
}