package com.shinhan.naengtureat.recipe.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.entity.Recipe;


public interface RecipeRepository extends JpaRepository<Recipe, Long> {
	
	// 사용자가 작성한 레시피만 조회
    List<Recipe> findByMemberId(Long memberId);
    
    // recipeId로 레시피 삭제 (Service에서 권한 체크 후 호출)
    void deleteById(Long recipeId);

    // recipeId와 memberId로 레시피 삭제 (Service에서 사용자가 권한이 있는지 체크)
    //void deleteByIdAndMemberId(Long recipeId, Long memberId);
	
	@Query("select distinct category from #{#entityName}")
	List<String> findCategoryAll();

}
