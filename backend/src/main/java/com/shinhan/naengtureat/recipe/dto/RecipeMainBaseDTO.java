package com.shinhan.naengtureat.recipe.dto;

import lombok.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class RecipeMainBaseDTO {
    private Long id;
    private String name;
    private String level;
    private String cookingTime;
    private String memberName;
    private String memberImage;
    private String category;
    private String mealName;
    private String image;
    private Boolean isDelete;
}