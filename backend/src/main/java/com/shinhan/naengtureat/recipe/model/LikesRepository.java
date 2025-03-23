package com.shinhan.naengtureat.recipe.model;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.entity.Likes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikesRepository extends JpaRepository<Likes, Long>{
	Optional<Likes> findByRecipeIdAndMemberId(Long recipeId, Long memberId);

	Optional<List<Likes>> findAllByMember(Member member);
}
