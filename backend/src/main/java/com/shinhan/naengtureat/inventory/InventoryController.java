package com.shinhan.naengtureat.inventory;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.ingredient.model.IngredientService;
import com.shinhan.naengtureat.inventory.dto.InventoryDTO;
import com.shinhan.naengtureat.inventory.model.InventoryService;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.member.model.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    MemberService memberService;

    @Autowired
    InventoryService inventoryService;

    @Autowired
    IngredientService ingredientService;

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

    @DeleteMapping("/{inventoryId}")
    public ResponseEntity<Object> deleteInventory(@PathVariable("inventoryId") Long inventoryId) {
        InventoryDTO inventoryDTO = inventoryService.getInventoryById(inventoryId);
        String result = inventoryService.deleteInventory(inventoryDTO);
        return ResponseEntity.ok(result);
    }
}
