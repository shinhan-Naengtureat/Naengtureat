package com.shinhan.naengtureat.inventory;

import com.shinhan.naengtureat.ingredient.dto.IngredientComparisonDTO;
import com.shinhan.naengtureat.inventory.dto.InventoryRequestDTO;
import com.shinhan.naengtureat.inventory.dto.InventoryResponseDTO;

import com.shinhan.naengtureat.inventory.model.InventoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Slf4j
@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    InventoryService inventoryService;

	@GetMapping("/{inventoryId}")
	public ResponseEntity<Object> getInventoryById(@PathVariable("inventoryId") Long inventoryId) {
		InventoryResponseDTO inventoryById = inventoryService.getInventoryById(inventoryId);
		return ResponseEntity.ok(inventoryById);
	}

	@GetMapping
	public ResponseEntity<Object> getAllInventory() {
		List<InventoryResponseDTO> allInventory = inventoryService.getAllInventory(1L);
		return ResponseEntity.ok(allInventory);
	}

    @PostMapping("/new")
    public ResponseEntity<Object> createInventory(@RequestBody InventoryRequestDTO inventoryRequestDTO) {
        // todo: memberDTO, IngredientDTO 수정 및 로직 수정
        if (inventoryRequestDTO.getIngredientId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("ingredientId 값이 필요합니다.");
        }

        inventoryRequestDTO.setMemberId(1L);
        String resultMessage = inventoryService.createInventory(inventoryRequestDTO);
        return ResponseEntity.ok(resultMessage);
    }

	@PutMapping
	public ResponseEntity<Object> updateInventory(@RequestBody InventoryRequestDTO inventoryRequestDTO) {
		if (inventoryRequestDTO.getIngredientId() == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("ingredientId 값이 필요합니다.");
		}

		inventoryRequestDTO.setMemberId(1L);
		String resultMessage = inventoryService.updateInventory(inventoryRequestDTO);
		return ResponseEntity.ok(resultMessage);
	}

	@GetMapping("/search/{keyword}")
	public ResponseEntity<Object> searchInventoryByKeyword(@PathVariable("keyword") String keyword) {
		List<InventoryResponseDTO> inventoryResponseDTOS = inventoryService.searchInventoryByKeyword(keyword);
		if (inventoryResponseDTOS.isEmpty()) {
			Map<String, String> response = new HashMap<>();
			response.put("message", "찾는 재료가 없어요.");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
		return ResponseEntity.ok(inventoryService.searchInventoryByKeyword(keyword));
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
