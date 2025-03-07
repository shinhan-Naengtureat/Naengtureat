package com.shinhan.naengtureat.inventory;

import com.shinhan.naengtureat.inventory.dto.InventoryDTO;
import com.shinhan.naengtureat.inventory.model.InventoryService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    InventoryService inventoryService;

    @PostMapping("/new")
    public ResponseEntity<Object> createInventory(HttpSession session,
                                                  @RequestBody InventoryDTO inventoryDTO) {
        // todo: memberDTO, IngredientDTO 수정 및 로직 수정
        // Member member = (Member) session.getAttribute("member");
        if (inventoryDTO.getIngredientId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("ingredientId 값이 필요합니다.");
        }

        inventoryDTO.setMemberId(1L);
        String resultMessage = inventoryService.createInventory(inventoryDTO);
        return ResponseEntity.ok(resultMessage);
    }

}
