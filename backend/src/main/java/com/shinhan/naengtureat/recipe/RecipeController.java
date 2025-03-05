package com.shinhan.naengtureat.recipe;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.recipe.dto.RecipeDTO;
import com.shinhan.naengtureat.recipe.model.RecipeService;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/recipe")
public class RecipeController {

	@Autowired
	RecipeService recipeService;

	@PostMapping("/new")
	public ResponseEntity<String> insertRecipe(@RequestBody RecipeDTO recipeDto, HttpSession session) {
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = (Long) session.getAttribute("memberId");
			if (memberId == null) {
				memberId = 0L; // 임시값 설정 (예: 0L)
			}

			// 서비스에 DTO와 memberId를 넘김
			recipeService.registerRecipe(recipeDto, memberId);

			return new ResponseEntity<>("레시피가 성공적으로 등록되었습니다.", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("레시피 등록 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
