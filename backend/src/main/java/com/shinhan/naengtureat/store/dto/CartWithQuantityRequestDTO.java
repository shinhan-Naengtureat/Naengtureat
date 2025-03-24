package com.shinhan.naengtureat.store.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartWithQuantityRequestDTO {
    private Long storeId;
    private List<IngredientQuantityDTO> ingredients;
}
