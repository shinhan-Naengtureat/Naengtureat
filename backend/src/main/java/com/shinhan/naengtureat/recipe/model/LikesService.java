package com.shinhan.naengtureat.recipe.model;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.member.model.MemberRepository;
import com.shinhan.naengtureat.recipe.entity.Likes;
import com.shinhan.naengtureat.recipe.entity.Recipe;

import jakarta.transaction.Transactional;

@Service
public class LikesService {
	
	@Autowired
	private LikesRepository likeRepository;
	
	@Autowired
	private RecipeRepository recipeRepository;
	
	@Autowired
	private MemberRepository memberRepository;
	
	@Transactional
	public void insertLikes(Long recipeId, Long memberId) {
		
		Recipe recipe = recipeRepository.findById(recipeId).orElse(null);
		Member member = memberRepository.findById(memberId).orElse(null);
		
        Optional<Likes> likesCheck = likeRepository.findByRecipeIdAndMemberId(recipeId,memberId);
        if(likesCheck.isPresent()) {
        	throw new IllegalArgumentException("이미 좋아요를 누른 레시피입니다.");
        }
		
		Likes like = new Likes();
		like.setRecipe(recipe);
		like.setMember(member);
		
		likeRepository.save(like);
	}
	
	public void deleteLikes(Long likeId) {
		likeRepository.deleteById(likeId);
	}

}
