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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.util.NoSuchElementException;

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

        InventoryDTO inventoryDTO = InventoryDTO.builder()
                .id(2L)
                .memo("내가 산 재료")
                .inventoryExpDate(LocalDate.parse("2025-03-15"))
                .inputDate(LocalDate.parse("2025-03-15"))
                .quantity(3)
                .nickName("으억 내가 먹을거야")
                .memberId(memberId)
                .build();

        //when
        if (inventoryDTO.getQuantity() <= 0) {
            throw new IllegalArgumentException("재료 수량은 0 이상 이여야 합니다.");
        }
        // 기존 재고 조회
        Inventory inventory = inventoryRepository.findById(inventoryDTO.getId())
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 재료 입니다."));

        //재료 검증
        Ingredient ingredient = ingredientService.getStandardIngredientById(inventoryDTO.getIngredientId());

        inventory.setQuantity(inventoryDTO.getQuantity());  //변경된 수량 등록
        inventory.setNickName(inventoryDTO.getNickName());  //변경된 닉네임 등록
        inventory.setMemo(inventoryDTO.getMemo());  //변경된 메모 등록
        inventory.setInventoryExpDate(inventoryDTO.getInventoryExpDate());  //변경된 유효기간 등록
        inventory.setInputDate(inventoryDTO.getInputDate());  //변경된 인입일 등록
        inventory.setIngredient(ingredient);  // 유효한 재료 등록

        //then
        Inventory newInventory = inventoryRepository.findById(2L).orElse(null);
        assertEquals(newInventory.getNickName(), "으억 내가 먹을거야");
        assertEquals(newInventory.getMember().getId(), 1L);
    }
}
