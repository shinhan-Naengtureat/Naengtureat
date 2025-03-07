package com.shinhan.naengtureat.recipe.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.recipe.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long>{
	
	//레시피의 댓글조회
    public List<Comment> findByRecipeId(Long recipeId);
}
