package com.shinhan.naengtureat.recipe.model;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.recipe.entity.Hashtag;
import com.shinhan.naengtureat.recipe.entity.RecipeHashtag;

public interface HashtagRepository extends JpaRepository<Hashtag, Long> {
	
	// 해시태그 ID로 특정 해시태그 조회
    Optional<Hashtag> findById(Long id);

    // 특정 키워드로 해시태그 조회 (중복 방지용)
    Optional<Hashtag> findByKeyword(String keyword);

}
