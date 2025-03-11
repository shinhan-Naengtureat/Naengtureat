package com.shinhan.naengtureat.recipe.model;

import java.util.List;
import java.util.Optional;

import com.shinhan.naengtureat.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.recipe.entity.Likes;

public interface LikesRepository extends JpaRepository<Likes, Long>{
	Optional<Likes> findByRecipeIdAndMemberId(Long recipeId, Long memberId);

	Optional<List<Likes>> findAllByMember(Member member);
}
