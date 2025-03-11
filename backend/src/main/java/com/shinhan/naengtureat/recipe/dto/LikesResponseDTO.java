package com.shinhan.naengtureat.recipe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikesResponseDTO {
    private Long mealId;
    private String mealName;
    private String name;
    private String level;
    private String cookingTime;
    private String serving;
    private String image;
    private String category;
    private List<Long> hashtagIds;
}
