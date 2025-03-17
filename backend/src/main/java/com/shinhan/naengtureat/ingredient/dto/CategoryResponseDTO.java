package com.shinhan.naengtureat.ingredient.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponseDTO {
    private Long ingredientId;
    private String bigCategory;
    private String smallCategory;
    private String ingredientUnit;
    private String standardImage;
    private Integer standardExpDate;
}
