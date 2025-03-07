package com.shinhan.naengtureat;

import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.ingredient.model.IngredientService;
import com.shinhan.naengtureat.inventory.dto.InventoryDTO;
import com.shinhan.naengtureat.inventory.entity.Inventory;
import com.shinhan.naengtureat.inventory.model.InventoryRepository;
import com.shinhan.naengtureat.inventory.model.InventoryService;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.member.model.MemberService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class InventoryCRUDTest {
    @Autowired
    InventoryService inventoryService;

    @Autowired
    IngredientService ingredientService;
    @Autowired
    private InventoryRepository inventoryRepository;
    @Autowired
    MemberService memberService;

    @Test
    public void editInventory() throws Exception {
        //given
        Long ingredientId = 92L;
        Long memberId = 1L;
        Member memberById = memberService.getMemberById(memberId);


        InventoryDTO inventoryDTO = InventoryDTO.builder()
                .id(2L)
                .memo("내가 산 재료")
                .inventoryExpDate(LocalDate.parse("2025-03-15"))
                .inputDate(LocalDate.parse("2025-03-15"))
                .quantity(3)
                .nickName("완전 맛없는 앞다리살")
                .member(memberById)
                .build();

        //when

        Ingredient ingredient = ingredientService.getStandardIngredientById(ingredientId);
        inventoryDTO.setIngredient(ingredient);
        Inventory inventory = inventoryService.convertEntity(inventoryDTO);

        inventoryRepository.save(inventory);

        //then
        Inventory newInventory = inventoryRepository.findById(2L).orElse(null);

        assertEquals(newInventory.getNickName(), "완전 맛없는 앞다리살");
        assertEquals(newInventory.getMember().getId(), 1L);

    }
}
