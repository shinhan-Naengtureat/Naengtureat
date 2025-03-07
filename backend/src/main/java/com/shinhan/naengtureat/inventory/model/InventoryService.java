package com.shinhan.naengtureat.inventory.model;


import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.ingredient.model.IngredientService;
import com.shinhan.naengtureat.inventory.dto.InventoryDTO;
import com.shinhan.naengtureat.inventory.entity.Inventory;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.ingredient.dto.IngredientComparisonDTO;

@Service
@Slf4j
public class InventoryService {
    @Autowired
    InventoryRepository inventoryRepository;

    @Autowired
    IngredientService ingredientService;

    @Transactional
    public String createInventory(InventoryDTO inventoryDTO) {
        if (inventoryDTO.getQuantity() <= 0) {
            throw new IllegalArgumentException("재료 수량은 0이상 이여야 합니다.");
        }

        // 유효성 검사를 위해 재료 검색
        Ingredient ingredient = ingredientService.getStandardIngredientById(inventoryDTO.getIngredientId());

        Inventory inventory = convertEntity(inventoryDTO);


        inventory.setIngredient(ingredient);  // 유효한 재료 등록
        inventoryRepository.save(inventory);
        return "재료 저장이 완료되었습니다.";
    }


    public InventoryDTO convertDto(Inventory inventory) {
        ModelMapper mapper = new ModelMapper();
        return mapper.map(inventory, InventoryDTO.class);
    }

    public Inventory convertEntity(InventoryDTO inventoryDTO) {
        ModelMapper mapper = new ModelMapper();
        return mapper.map(inventoryDTO, Inventory.class);
    }
    public List<IngredientComparisonDTO> getListNotEnoughIngredient(Long memberId,LocalDate start_date, LocalDate end_date) {
    	//날짜 두개를 입력 받고 , 그 사이에 있는 식단(레시피)를 조회
    	List<Object[]> results = inventoryRepository.compareInventoryWithMealPlan(memberId,start_date,end_date);
    	 return results.stream()
                 .map(row -> new IngredientComparisonDTO(
                         row[0] != null ? ((Number) row[0]).longValue() : null, // memberIngredientId 사용자가 가지고 있는 재료 ID (nullable)
                         row[1] != null ? ((Number) row[1]).intValue() : 0, // memberQuantity 사용자가 보유한 재료 개수 (nullable, default 0)
                         (String) row[2], // b_name 재료 카테고리명
                         ((Number) row[3]).longValue(), // mealPlanIngredientId  필요한 재료 ID
                         ((Number) row[4]).intValue(),  // mealPlanQuantity 필요한 재료 개수
                         (String) row[5] // b_recipe_name 레시피명
                 ))
                 .collect(Collectors.toList());
    }
}
