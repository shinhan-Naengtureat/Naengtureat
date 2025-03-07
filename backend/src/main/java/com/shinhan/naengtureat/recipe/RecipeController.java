package com.shinhan.naengtureat.recipe;


import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PathVariable;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.dto.RecipeDTO;
import com.shinhan.naengtureat.recipe.entity.Recipe;
import com.shinhan.naengtureat.recipe.model.LikesService;
import com.shinhan.naengtureat.recipe.model.RecipeService;
import com.shinhan.naengtureat.recipe.vo.RecipeVO;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/recipe")
public class RecipeController {

	@Autowired
	RecipeService recipeService;
	
	@Autowired
	LikesService likesService;

	// 전체 레시피 조회
	@GetMapping
	public ResponseEntity<Object> getAllRecipes() {
		try {
			List<RecipeVO> recipes = recipeService.getAllRecipes();
			return ResponseEntity.ok(recipes);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "레시피 조회 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	@PostMapping("/new")
	public ResponseEntity<String> insertRecipe(@RequestBody RecipeDTO recipeDto, HttpSession session) {
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = (Long) session.getAttribute("memberId");
			if (memberId == null) {
				memberId = 2L; // 임시값 설정 (예: 0L) 로그인설정되면 지워야함
			}

			// 서비스에 DTO와 memberId를 넘김
			recipeService.registerRecipe(recipeDto, memberId);

			return new ResponseEntity<>("레시피가 성공적으로 등록되었습니다.", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("레시피 등록 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@GetMapping("/myrecipe/{mid}")
	public ResponseEntity<Object> getMethodName(@PathVariable("mid") Long mid ) {
		Member member = Member.builder().id(mid).build();
		List<Recipe> recipeList = recipeService.findRecipeByMember(member);
		return ResponseEntity.ok(recipeList);
	}
	
	// 좋아요 토글 API
    @PostMapping("/{recipe_id}/like")
    public ResponseEntity<String> toggleLikes(@PathVariable("recipe_id") Long recipeId, HttpSession session) {
        Long memberId = (Long) session.getAttribute("memberId");
        if (memberId == null) {
			memberId = 2L; // 임시값 설정 (예: 0L) 로그인설정되면 지워야함
        }

        likesService.toggleLikes(recipeId, memberId);
        return ResponseEntity.ok("좋아요 상태가 변경되었습니다.");
    }
	
}
