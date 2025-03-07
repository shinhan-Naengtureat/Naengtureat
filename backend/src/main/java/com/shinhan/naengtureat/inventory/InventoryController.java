package com.shinhan.naengtureat.inventory;

import com.shinhan.naengtureat.ingredient.dto.IngredientComparisonDTO;
import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.ingredient.model.IngredientService;
import com.shinhan.naengtureat.inventory.dto.InventoryDTO;
import com.shinhan.naengtureat.inventory.model.InventoryService;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.member.model.MemberService;
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
    
	// 식단 재료 - 멤버 보유 재료 목록 조회
	@GetMapping("/gap")
	public ResponseEntity<Object> getNotEnoughIngredientList(@RequestParam("start_date") LocalDate start_date,
															 @RequestParam("end_date") LocalDate end_date) {
		Long memberId = 2L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)
		try {
			List<IngredientComparisonDTO> gapList = inventoryService.getListNotEnoughIngredient(memberId, start_date,end_date);
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
