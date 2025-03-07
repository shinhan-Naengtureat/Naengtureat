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
	
	 // 좋아요 여부 체크 (Optional 반환)
    public Optional<Likes> checkLikes(Long recipeId, Long memberId) {
        return likeRepository.findByRecipeIdAndMemberId(recipeId, memberId);
    }

    // 좋아요 추가,삭제
    @Transactional
    public void toggleLikes(Long recipeId, Long memberId) {
        Optional<Likes> likesCheck = checkLikes(recipeId, memberId);

        if (likesCheck.isPresent()) {
            // 좋아요 삭제
            likeRepository.deleteById(likesCheck.get().getId());
        } else {
            // 좋아요 추가
            Recipe recipe = recipeRepository.findById(recipeId).orElseThrow(() -> new IllegalArgumentException("레시피가 존재하지 않습니다."));
            Member member = memberRepository.findById(memberId).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

            Likes like = new Likes();
            like.setRecipe(recipe);
            like.setMember(member);
            likeRepository.save(like);
        }
    }

}
