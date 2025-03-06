package com.shinhan.naengtureat.inventory.model;

import com.shinhan.naengtureat.ingredient.model.IngredientRepository;
import com.shinhan.naengtureat.inventory.dto.InventoryDTO;
import com.shinhan.naengtureat.inventory.entity.Inventory;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class InventoryService {
    @Autowired
    InventoryRepository inventoryRepository;

    public String createInventory(InventoryDTO inventoryDTO) {
        if (inventoryDTO.getQuantity() <= 0) {
            throw new IllegalArgumentException("인벤토리 수량은 0이상 이여야 합니다.");
        }

        inventoryRepository.save(convertEntity(inventoryDTO));
        return "인벤토리 저장이 완료되었습니다.";
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
