package com.shinhan.naengtureat.recipe.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shinhan.naengtureat.recipe.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long>{
	@Query("SELECT c FROM Comment c JOIN FETCH c.recipe WHERE c.recipe.id = :recipeId")
    List<Comment> findCommentsByRecipeId(@Param("recipeId") Long recipeId);
}
