package com.shinhan.naengtureat.inventory;

import com.shinhan.naengtureat.ingredient.dto.IngredientComparisonDTO;
import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.ingredient.model.IngredientService;

import com.shinhan.naengtureat.inventory.dto.InventoryDTO;
import com.shinhan.naengtureat.inventory.model.InventoryService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    
	// 식단 재료 - 멤버 보유 재료 목록 조회
	@GetMapping("/gap")
	public ResponseEntity<Object> getNotEnoughIngredientList(@RequestParam("startDate") LocalDate startDate,
															 @RequestParam("endDate") LocalDate endDate) {
		Long memberId = 2L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)
		try {
			List<IngredientComparisonDTO> gapList = inventoryService.getListNotEnoughIngredient(memberId, startDate,endDate);
			// 결과가 비어 있으면 204 No Content 반환
			if (gapList.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body("부족한 재료가 없습니다.");
			}
			
			return ResponseEntity.ok(gapList);
		
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생: " + e.getMessage());
		}

	}

}
