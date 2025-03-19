package com.shinhan.naengtureat.recipe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopRecipeResponseDTO {
    private Long id;
    private Long mealId;
    private String mealMealname;
    private Long memberId;
    private String memberName;
    private String memberImage;
    private String name;
    private int price;
    private String level;
    private String cookingTime;
    private String serving;
    private String image;
    private Boolean isDelete;
    private Boolean liked;
}
