package com.shinhan.naengtureat.recipe.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.entity.Recipe;

public interface RecipeRepository extends JpaRepository<Recipe, Long>{
	
	
	List<Recipe>  findByMember(Member member);
	
}
