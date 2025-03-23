package com.shinhan.naengtureat.recipe.dto;

import java.util.LinkedHashSet;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class RecipeMainDTO {
    private Long id;
    private String name;
    private String level;
    private String cookingTime;
    private String memberName;
    private String category;
    private String mealName;
    private String image;
    private Boolean isDelete;
    private String aggregatedIngredients;
    private String aggregatedHashtags;
    private Long likeCount;  

    public RecipeMainDTO(Long id, String name, String level, String cookingTime, String memberName, String category,
                         String mealName, String image, Boolean isDelete, Object aggregatedIngredients, 
                         Object aggregatedHashtags, Long likeCount) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.cookingTime = cookingTime;
        this.memberName = memberName;
        this.category = category;
        this.mealName = mealName;
        this.image = image;
        this.isDelete = isDelete;
        this.aggregatedIngredients = removeDuplicates(aggregatedIngredients != null ? aggregatedIngredients.toString() : null);
        this.aggregatedHashtags = removeDuplicates(aggregatedHashtags != null ? aggregatedHashtags.toString() : null);
        this.likeCount = likeCount;
    }
    
    private String removeDuplicates(String input) {
        if (input == null || input.isEmpty()) return input;
        String[] parts = input.split(",");
        Set<String> distinct = new LinkedHashSet<>();
        for (String part : parts) {
            distinct.add(part.trim());
        }
        return String.join(",", distinct);
    }
}