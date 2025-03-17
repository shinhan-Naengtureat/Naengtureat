package com.shinhan.naengtureat.recipe;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.common.response.BaseResponse;
import com.shinhan.naengtureat.mealplan.dto.MealPlanCheckDTO;
import com.shinhan.naengtureat.mealplan.dto.MealPlanDTO;
import com.shinhan.naengtureat.recipe.dto.CommentDTO;
import com.shinhan.naengtureat.recipe.dto.MyRecipeDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeDTO;
import com.shinhan.naengtureat.recipe.dto.RecipeDetailDTO;
import com.shinhan.naengtureat.recipe.entity.Likes;
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
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(BaseResponse.builder().message("레시피 조회 중 오류 발생: " + e.getMessage()).build());
		}
	}

	@GetMapping("/like")
	public ResponseEntity<Object> getLikeRecipeList() {
		Long memberId = 3L;
		return ResponseEntity.ok(likesService.getLikeRecipeList(memberId));
	}

	// 좋아요 삭제
	@DeleteMapping("/like/{likeId}")
	public ResponseEntity<Object> deleteLikeRecipe(@PathVariable("likeId") Long likeId) {
		Long memberId = 3L;
		Likes likesRecipe = likesService.getLikeById(likeId)
				.orElseThrow(() -> new NoSuchElementException("좋아요한 레시피가 없습니다."));

		if (likesRecipe.getMember().getId() == memberId) {
			return ResponseEntity.ok(likesService.deleteLikeRecipe(likesRecipe));
		} else {
			throw new IllegalArgumentException("해당 멤버로 좋아요한 레시피가 아닙니다.");
		}
	}

	// 상세 레시피 조회
	@GetMapping("/{recipeId}")
	public ResponseEntity<Object> getRecipeDetail(@PathVariable("recipeId") Long recipeId) {
		try {
			RecipeDetailDTO recipeDetail = recipeService.getRecipeDetail(recipeId);
			return ResponseEntity.ok(recipeDetail);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(BaseResponse.builder().message("레시피 상세조회 중 오류가 발생했습니다: " + e.getMessage()).build());
		}
	}

	// 레시피 등록
	@PostMapping("/new")
	public ResponseEntity<Object> insertRecipe(@RequestBody RecipeDTO recipeDto) {
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 3L; // security 적용시 코드 수정 필요

			// 서비스에 DTO와 memberId를 넘김
			recipeService.registerRecipe(recipeDto, memberId);

			return ResponseEntity.ok(BaseResponse.builder().message("레시피 등록 성공").build());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(BaseResponse.builder().message("레시피 등록 중 오류가 발생했습니다: " + e.getMessage()).build());
		}
	}



	// 마이페이지- 내 레시피 전체 목록 조회
	@GetMapping("/myrecipeList")
	public ResponseEntity<Object> getMyRecipe() {

		try {
			// SecurityContext에서 로그인된 사용자 정보 가져오기
			Long memberId = 3L;

			if (memberId == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(BaseResponse.builder().message("로그인이 필요합니다.").build());
			}

			// 로그인된 사용자의 레시피 조회
			List<MyRecipeDTO> recipeList = recipeService.getMyRecipe(memberId);
			return ResponseEntity.ok(recipeList);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponse.builder().message("마이 레시피 조회 중 오류 발생").build());
		}
	}

	// 마이페이지- 내 레시피 단건 삭제
	@DeleteMapping("/{recipeId}")
	public ResponseEntity<Object> deleteMyRecipe(@PathVariable("recipeId") Long recipeId) {
		try {
			// SecurityContext에서 로그인된 사용자 정보 가져오기
			// Long memberId = getLoggedInMemberId();
			Long memberId = 3L;

			if (memberId == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(BaseResponse.builder().message("로그인이 필요합니다.").build());
			}

			// 레시피 삭제 서비스 호출 (논리적 삭제)
	        String result = recipeService.deleteMyRecipe(memberId, recipeId);

			return ResponseEntity.ok(BaseResponse.builder().message(result).build());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponse.builder().message("레시피 삭제 중 오류 발생").build());
		}
	}
	
	// 마이페이지- 내 레시피 수정
	@PutMapping("/{recipeId}")
	public ResponseEntity<Object> updateMyRecipe(@PathVariable("recipeId") Long recipeId,  @RequestBody RecipeDTO recipeDTO) {
		try {
			
			Long memberId = 3L;
			recipeDTO.setId(recipeId);		
	        String result = recipeService.updateRecipe(memberId, recipeDTO);
	        
	        return ResponseEntity.ok(BaseResponse.builder().message(result).build());
	        
	    } catch (Exception e) {
	        e.printStackTrace();

	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponse.builder().message("레시피 수정 중 오류 발생"));
	    }
	}


	// 댓글 등록
	@PostMapping("/{recipeId}/comment")
	public ResponseEntity<Object> createComment(@PathVariable("recipeId") Long recipeId,
			@RequestBody CommentDTO commentDto) {
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 3L; // security 적용시 코드 수정 필요

			// 댓글 등록 서비스 호출
			CommentDTO savedComment = recipeService.addComment(recipeId, memberId, commentDto.getContent());

			return ResponseEntity.ok(savedComment);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(BaseResponse.builder().message("댓글 등록에 실패하였습니다: " + e.getMessage()).build());
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
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(BaseResponse.builder().message("댓글 수정에 실패하였습니다: " + e.getMessage()).build());
		}
	}

	// 댓글 삭제
	@DeleteMapping("/comment/{commentId}")
	public ResponseEntity<Object> deleteComment(@PathVariable("commentId") Long commentId) {
		try {
			recipeService.deleteComment(commentId);
			return ResponseEntity.ok(BaseResponse.builder().message("댓글 삭제 성공").build());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(BaseResponse.builder().message("댓글 삭제 중 오류가 발생했습니다: " + e.getMessage()).build());
		}
	}

	// 댓글 조회
	@GetMapping("/{recipeId}/comment")
	public ResponseEntity<Object> getComment(@PathVariable("recipeId") Long recipeId) {
		try {
			List<CommentDTO> comments = recipeService.getComments(recipeId);
			return ResponseEntity.ok(comments);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(BaseResponse.builder().message("댓글 조회 중 오류가 발생했습니다: " + e.getMessage()).build());
		}
	}


	// 좋아요 토글 API
	@PostMapping("/like/{recipeId}")
	public ResponseEntity<Object> toggleLikes(@PathVariable("recipeId") Long recipeId) {
		try {
			Long memberId = 3L; // security 적용시 수정 필요
			likesService.toggleLikes(recipeId, memberId);
			return ResponseEntity.ok(BaseResponse.builder().message("좋아요 상태 변경 성공").build());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(BaseResponse.builder().message("좋아요 중 오류가 발생했습니다: " + e.getMessage()).build());
		}
	}

	// 카테고리별 레시피 조회
	@GetMapping("/category")
	public ResponseEntity<Object> getRecipesByCategory(@RequestParam("category") List<String> categories) {
	    try {
	        // 예시: 여러 카테고리 중 하나라도 해당하는 레시피 조회 (서비스 로직 수정 필요)
	        List<RecipeDTO> recipes = recipeService.getRecipesByCategory(categories);
	        return ResponseEntity.ok(recipes);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body(BaseResponse.builder().message("카테고리별 레시피 조회 중 오류가 발생했습니다: " + e.getMessage()).build());
	    }
	}

	// 마음에드는 레시피를 내 식단에 추가
	@PostMapping("/{recipeId}/mealplan")
	public ResponseEntity<Object> addMealPlan(@PathVariable("recipeId") Long recipeId,
			@RequestBody MealPlanCheckDTO requestDTO) {
		try {
			MealPlanDTO mealPlanDTO = recipeService.createOrUpdateMealPlan(requestDTO.getMemberId(), recipeId,
					requestDTO.getDate(), requestDTO.getType());
			return ResponseEntity.ok(mealPlanDTO);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(BaseResponse.builder().message("식단 계획 추가 중 오류가 발생했습니다: " + e.getMessage()).build());
		}
	}

	// 대분류 필터
	@GetMapping("/bigcategory")
	public ResponseEntity<Object> getRecipesByBigCategory(@RequestParam("bigCategory") List<String> bigCategory) {
		try {
			List<RecipeDTO> recipes = recipeService.getRecipesByBigCategory(bigCategory);
			return ResponseEntity.ok(recipes);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(BaseResponse.builder().message("대분류 필터링 중 오류가 발생했습니다: " + e.getMessage()).build());
		}
	}

	// 레시피 정렬(추천순,최신순,난이도순,조리시간순)
	@GetMapping("/sort")
	public ResponseEntity<Object> getSortedRecipes(@RequestParam("sortType") String sortType) {
		try {
			List<RecipeDTO> recipes = recipeService.getRecipesSorted(sortType);
			return ResponseEntity.ok(recipes);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(BaseResponse.builder().message("레시피 정렬 중 오류가 발생했습니다: " + e.getMessage()).build());
		}
	}

	// 레시피 검색
	@GetMapping("/search/{keyword}")
	public ResponseEntity<Object> searchRecipes(@PathVariable("keyword") String keyword) {
		try {
			List<RecipeDTO> recipes = recipeService.searchRecipes(keyword);
			return ResponseEntity.ok(recipes);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(BaseResponse.builder().message("레시피 검색 중 오류가 발생했습니다: " + e.getMessage()).build());
		}
	}

}
