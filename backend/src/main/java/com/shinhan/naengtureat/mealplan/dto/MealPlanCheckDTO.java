package com.shinhan.naengtureat.mealplan.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealPlanCheckDTO {
	private Long memberId;      
    private LocalDate date; 
    private String type;        
}
