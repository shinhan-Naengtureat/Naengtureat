package com.shinhan.naengtureat.inventory.model;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.ingredient.model.IngredientService;
import com.shinhan.naengtureat.inventory.dto.InventoryDTO;
import com.shinhan.naengtureat.inventory.entity.Inventory;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
