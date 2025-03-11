package com.shinhan.naengtureat.recipe.model;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.member.model.MemberRepository;
import com.shinhan.naengtureat.recipe.dto.LikesRequestDTO;
import com.shinhan.naengtureat.recipe.dto.LikesResponseDTO;
import com.shinhan.naengtureat.recipe.entity.Likes;
import com.shinhan.naengtureat.recipe.entity.Recipe;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class LikesService {
	
	@Autowired
	private LikesRepository likeRepository;
	
	@Autowired
	private RecipeRepository recipeRepository;
	
	@Autowired
	private MemberRepository memberRepository;

    ModelMapper mapper = new ModelMapper();

	 // 좋아요 여부 체크 (Optional 반환)
    public Optional<Likes> checkLikes(Long recipeId, Long memberId) {
        return likeRepository.findByRecipeIdAndMemberId(recipeId, memberId);
    }

    /**
     * 1. 좋아요에 있는 멤버아이디와 매칭되는 레시피 id 모두 불러오기
     * 2. List<Recipe> 형태로 반환하기
     * */
    public List<LikesResponseDTO> getLikeRecipeList(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new NoSuchElementException("멤버를 찾을 수 없습니다."));

        List<Likes> likeRecipeList = likeRepository.findAllByMember(member)
                .orElseThrow(() -> new NoSuchElementException("좋아요한 레시피가 없습니다."));

        return likeRecipeList.stream()
                .map(like -> mapToResponseDTO(like.getRecipe()))
                .toList();
    }

    private LikesResponseDTO mapToResponseDTO(Recipe recipe) {
        if (recipe == null) {
            throw new NoSuchElementException("찾는 레시피가 없습니다.");
        }

        return LikesResponseDTO.builder()
                .mealId(recipe.getMeal().getId())
                .mealName(recipe.getMeal().getMealName())
                .name(recipe.getName())
                .level(recipe.getLevel())
                .cookingTime(recipe.getCookingTime())
                .serving(recipe.getServing())
                .image(recipe.getImage())
                .category(recipe.getCategory())
                .hashtagIds(recipe.getHashtags().stream()
                        .map(recipeHashtag -> {
                            return recipeHashtag.getHashtag().getId();
                        })
                        .toList())
                .build();
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
