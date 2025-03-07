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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.dto.CommentDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeDTO;
import com.shinhan.naengtureat.recipe.entity.Recipe;
import com.shinhan.naengtureat.recipe.model.LikesService;
import com.shinhan.naengtureat.recipe.model.RecipeService;

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
			List<RecipeDTO> recipes = recipeService.getAllRecipes();
			return ResponseEntity.ok(recipes);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", "레시피 조회 중 오류 발생");
			errorResponse.put("message", e.getMessage()); // 예외 메시지 포함

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	// 레시피 등록
	@PostMapping("/new")
	public ResponseEntity<String> insertRecipe(@RequestBody RecipeDTO recipeDto) {
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 2L; // security 적용시 코드 수정 필요

			// 서비스에 DTO와 memberId를 넘김
			recipeService.registerRecipe(recipeDto, memberId);

			return new ResponseEntity<>("레시피가 성공적으로 등록되었습니다.", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("레시피 등록 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	// 댓글 등록
	@PostMapping("/{recipeId}/comment")
	public ResponseEntity<Object> createComment(@PathVariable("recipeId") Long recipeId,
			@RequestBody CommentDTO commentDto) {
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 2L; // security 적용시 코드 수정 필요

			// 댓글 등록 서비스 호출
			CommentDTO savedComment = recipeService.addComment(recipeId, memberId, commentDto.getContent());

			return ResponseEntity.ok(savedComment);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("댓글 등록에 실패하였습니다.");
		}
	}

	 // 댓글 수정
    @PutMapping("/comment/{commentId}")
    public ResponseEntity<Object> updateComment(@PathVariable("commentId") Long commentId,
            @RequestBody CommentDTO commentDto) {
        try {
            // 댓글 수정 서비스 호출
            CommentDTO updatedComment = recipeService.updateComment(commentId, commentDto);
            return ResponseEntity.ok(updatedComment); // 수정된 댓글 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("댓글 수정에 실패하였습니다.");
        }
    }
    
    // 댓글 삭제
	@DeleteMapping("/comment/{commentId}")
	public ResponseEntity<String> deleteComment(@PathVariable("commentId") Long commentId) {
		recipeService.deleteComment(commentId);
		return ResponseEntity.ok("delete ok");
	}
	
	// 댓글 조회
	@GetMapping("/{recipeId}/comment")
	public ResponseEntity<List<CommentDTO>> getComment(@PathVariable("recipeId") Long recipeId) {
	    List<CommentDTO> comments = recipeService.getComments(recipeId);
	    return ResponseEntity.ok(comments);
	}

	@GetMapping("/myrecipe/{memberId}")
	public ResponseEntity<Object> getMethodName(@PathVariable("memberId") Long mid) {
		Member member = Member.builder().id(mid).build();
		List<Recipe> recipeList = recipeService.findRecipeByMember(member);
		return ResponseEntity.ok(recipeList);
	}

    
	
	// 좋아요 토글 API
	@PostMapping("/like/{recipeId}")
	public ResponseEntity<String> toggleLikes(@PathVariable("recipeId") Long recipeId) {
		// 세션에서 로그인된 사용자 정보 가져오기
		Long memberId = 2L; // security 적용시 코드 수정 필요

		likesService.toggleLikes(recipeId, memberId);
		return ResponseEntity.ok("좋아요 상태가 변경되었습니다.");
	}
	
	// 카테고리별 레시피 조회
    @GetMapping("/{category}")
    public ResponseEntity<Object> getRecipesByCategory(@PathVariable("category") String category) {
        try {
            // 카테고리에 해당하는 레시피 목록 조회
            List<RecipeDTO> recipes = recipeService.getRecipesByCategory(category);
            return ResponseEntity.ok(recipes); // 성공적으로 레시피 목록 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // 예외 발생 시 BAD_REQUEST 반환
        }
    }
}
