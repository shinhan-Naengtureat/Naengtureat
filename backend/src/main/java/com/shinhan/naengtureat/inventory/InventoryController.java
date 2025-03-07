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
        // Member member = (Member) session.getAttribute("member");
        Member member = memberService.getMemberById(1L);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("로그인 필요합니다.");
        }

        if (inventoryDTO.getIngredient().getId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("ingredientId 값이 필요합니다.");
        }

        Ingredient ingredient = ingredientService.getStandardIngredientById(inventoryDTO.getIngredient().getId());

        inventoryDTO.setMember(member);
        inventoryDTO.setIngredient(ingredient);

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
