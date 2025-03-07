package com.shinhan.naengtureat.recipe.model;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.recipe.entity.Likes;

public interface LikesRepository extends JpaRepository<Likes, Long>{
	Optional<Likes> findByRecipeIdAndMemberId(Long recipeId, Long memberId);
}
