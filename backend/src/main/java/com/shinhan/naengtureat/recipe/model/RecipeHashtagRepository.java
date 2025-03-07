package com.shinhan.naengtureat.recipe.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.shinhan.naengtureat.recipe.entity.RecipeHashtag;

public interface RecipeHashtagRepository extends JpaRepository<RecipeHashtag, Long>{

	@Query("SELECT DISTINCT h.keyword"
			+ " FROM RecipeHashtag rh "
			+ " JOIN rh.hashtag h " )
	List<String>findThemeAll();
	
}
